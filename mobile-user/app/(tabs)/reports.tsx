"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MapPin, Calendar, CheckCircle, Clock, AlertCircle, Filter } from "lucide-react-native"
import Constants from "expo-constants"

// Mock data


export default function Reports() {
    const router = useRouter()
    const { filter } = useLocalSearchParams()
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState<string>(filter as string || "all")

    const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.20.56:3000"

    useEffect(() => {
        if (filter) {
            setActiveFilter(filter as string)
        }
    }, [filter])

    useFocusEffect(
        useCallback(() => {
            fetchReports()
        }, [activeFilter])
    )

    const fetchReports = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token")
            if (!token) {
                router.replace("/login")
                return
            }

            let url = `${API_URL}/api/reports`
            if (activeFilter !== "all") {
                url += `?status=${activeFilter}`
            }

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.ok) {
                const data = await response.json()
                setReports(data)
            } else {
                setReports([])
            }
        } catch (error) {
            console.error("Error fetching reports:", error)
            setReports([])
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "resolved": return <CheckCircle size={20} color="#10b981" />
            case "pending": return <Clock size={20} color="#f59e0b" />
            case "in_progress": return <Clock size={20} color="#3b82f6" />
            case "rejected": return <AlertCircle size={20} color="#ef4444" />
            default: return <Clock size={20} color="#71717a" />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "resolved": return "Resuelto"
            case "pending": return "Pendiente"
            case "in_progress": return "En Proceso"
            case "rejected": return "Rechazado"
            default: return status
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "#dcfce7"
            case "pending": return "#fef3c7"
            case "in_progress": return "#dbeafe"
            case "rejected": return "#fee2e2"
            default: return "#f4f4f5"
        }
    }

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "resolved": return "#166534"
            case "pending": return "#b45309"
            case "in_progress": return "#1e40af"
            case "rejected": return "#991b1b"
            default: return "#52525b"
        }
    }

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/report/${item.id}`)}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    {getStatusIcon(item.status)}
                    <Text style={[styles.statusText, { color: getStatusTextColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.locationContainer}>
                    <MapPin size={16} color="#71717a" />
                    <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Reportes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterChip, activeFilter === "all" && styles.filterChipActive]}
                        onPress={() => setActiveFilter("all")}
                    >
                        <Text style={[styles.filterText, activeFilter === "all" && styles.filterTextActive]}>Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, activeFilter === "pending" && styles.filterChipActive]}
                        onPress={() => setActiveFilter("pending")}
                    >
                        <Text style={[styles.filterText, activeFilter === "pending" && styles.filterTextActive]}>Pendientes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, activeFilter === "resolved" && styles.filterChipActive]}
                        onPress={() => setActiveFilter("resolved")}
                    >
                        <Text style={[styles.filterText, activeFilter === "resolved" && styles.filterTextActive]}>Resueltos</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay reportes para mostrar</Text>
                        </View>
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e4e4e7",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0a0a0a",
        marginBottom: 16,
    },
    filterContainer: {
        flexDirection: "row",
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f4f4f5",
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#e4e4e7",
    },
    filterChipActive: {
        backgroundColor: "#16a34a",
        borderColor: "#16a34a",
    },
    filterText: {
        color: "#71717a",
        fontWeight: "500",
    },
    filterTextActive: {
        color: "#ffffff",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    date: {
        fontSize: 12,
        color: "#71717a",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0a0a0a",
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        flex: 1,
    },
    locationText: {
        fontSize: 14,
        color: "#71717a",
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#71717a",
        fontSize: 16,
    },
})
