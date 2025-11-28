import pool from "../database/connection"
import type { Comment, CreateCommentDTO } from "../../domain/entities/Comment"
import type { ICommentRepository } from "../../domain/ports/ICommentRepository"

export class PostgresCommentRepository implements ICommentRepository {
  async findById(id: string): Promise<Comment | null> {
    const result = await pool.query("SELECT * FROM comments WHERE id = $1", [id])

    if (result.rows.length === 0) return null

    return this.mapRowToComment(result.rows[0])
  }

  async findByReportId(reportId: string): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, u.name as user_name 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.report_id = $1 
       ORDER BY c.created_at ASC`,
      [reportId]
    )

    return result.rows.map((row) => this.mapRowToComment(row))
  }

  async create(comment: CreateCommentDTO): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (report_id, user_id, content, is_admin)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [comment.reportId, comment.userId, comment.content, comment.isAdmin || false],
    )

    return this.mapRowToComment(result.rows[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM comments WHERE id = $1", [id])
    return result.rowCount !== null && result.rowCount > 0
  }

  private mapRowToComment(row: any): Comment {
    return {
      id: row.id.toString(),
      reportId: row.report_id.toString(),
      userId: row.user_id.toString(),
      content: row.content,
      isAdmin: row.is_admin,
      createdAt: row.created_at,
      userName: row.user_name,
    }
  }
}
