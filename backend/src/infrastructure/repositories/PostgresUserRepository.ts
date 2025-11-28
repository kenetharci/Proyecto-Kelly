import pool from "../database/connection"
import type { User, CreateUserDTO } from "../../domain/entities/User"
import type { IUserRepository } from "../../domain/ports/IUserRepository"

export class PostgresUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatar_url,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatar_url,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC")

    return result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatar_url,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }

  async create(user: CreateUserDTO): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, avatar_url, notifications_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        user.name,
        user.email,
        user.password,
        user.phone || null,
        user.role,
        user.avatarUrl || null,
        user.notificationsEnabled ?? true,
      ],
    )

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatar_url,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`)
      values.push(data.email)
    }
    if (data.password !== undefined) {
      fields.push(`password = $${paramCount++}`)
      values.push(data.password)
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`)
      values.push(data.phone)
    }
    if (data.role !== undefined) {
      fields.push(`role = $${paramCount++}`)
      values.push(data.role)
    }
    if (data.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramCount++}`)
      values.push(data.avatarUrl)
    }
    if (data.notificationsEnabled !== undefined) {
      fields.push(`notifications_enabled = $${paramCount++}`)
      values.push(data.notificationsEnabled)
    }

    if (fields.length === 0) return this.findById(id)

    values.push(id)
    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} RETURNING *`,
      values,
    )

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatar_url,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id])
    return result.rowCount !== null && result.rowCount > 0
  }
}
