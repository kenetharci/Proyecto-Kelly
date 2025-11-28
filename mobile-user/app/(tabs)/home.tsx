"use client"

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useRouter, useFocusEffect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Plus, AlertTriangle, Lightbulb, Trash2, Shield } from "lucide-react-native"
import Constants from "expo-constants"

export default function Home() {
  const router = useRouter()
  const [stats, setStats] = useState({ created: 0, resolved: 0 })
  const [userName, setUserName] = useState("")

  const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.20.56:3000"

  useFocusEffect(
    useCallback(() => {
      fetchStats()
    }, [])
  )

  const fetchStats = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user")
      const token = await AsyncStorage.getItem("token")

      if (userStr) {
        const user = JSON.parse(userStr)
        setUserName(user.name || "Usuario")

        // Fetch reports from backend
        const response = await fetch(`${API_URL}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const reports = await response.json()

          // Calculate stats from backend data
          const created = reports.length
          const resolved = reports.filter((r: any) => r.status === "resolved").length

          setStats({ created, resolved })
        } else {
          // Fallback to AsyncStorage if backend fails
          const reportsStr = await AsyncStorage.getItem(`reports_${user.id}`)
          if (reportsStr) {
            const reports = JSON.parse(reportsStr)
            const created = reports.length
            const resolved = reports.filter((r: any) => r.status === "resolved").length
            setStats({ created, resolved })
          } else {
            setStats({ created: 0, resolved: 0 })
          }
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Try to load from AsyncStorage as fallback
      try {
        const userStr = await AsyncStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          const reportsStr = await AsyncStorage.getItem(`reports_${user.id}`)
          if (reportsStr) {
            const reports = JSON.parse(reportsStr)
            const created = reports.length
            const resolved = reports.filter((r: any) => r.status === "resolved").length
            setStats({ created, resolved })
          }
        }
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
      }
    }
  }

  const categories = [
    { id: 1, name: "Basura", icon: Trash2, color: "#ef4444" },
    { id: 2, name: "Iluminación", icon: Lightbulb, color: "#f59e0b" },
    { id: 3, name: "Vías", icon: AlertTriangle, color: "#3b82f6" },
    { id: 4, name: "Seguridad", icon: Shield, color: "#8b5cf6" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Urbana Reporta</Text>
        <Text style={styles.subtitle}>Hola, {userName}</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push("/create-report")}>
          <Plus size={24} color="#ffffff" />
          <Text style={styles.createButtonText}>Crear Nuevo Reporte</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + "20" }]}>
                    <Icon size={32} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push({ pathname: "/(tabs)/reports", params: { filter: "all" } })}
            >
              <Text style={styles.statValue}>{stats.created}</Text>
              <Text style={styles.statLabel}>Reportes creados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push({ pathname: "/(tabs)/reports", params: { filter: "resolved" } })}
            >
              <Text style={styles.statValue}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resueltos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#16a34a",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0a0a0a",
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0a0a0a",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#16a34a",
  },
  statLabel: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 4,
  },
})
