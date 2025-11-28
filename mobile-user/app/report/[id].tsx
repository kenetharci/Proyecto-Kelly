"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MapPin } from "lucide-react-native"
import Constants from "expo-constants"

const { width } = Dimensions.get("window")

export default function ReportDetails() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [report, setReport] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.20.56:3000"

    useEffect(() => {
        fetchReportDetails()
    }, [id])

    const fetchReportDetails = async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            if (!token) {
                router.replace("/login")
                return
            }

            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.ok) {
                const data = await response.json()
                setReport({ ...data, images: data.imageUrls || [] })
            } else {
                setReport(null)
            }
        } catch (error) {
            console.error("Error fetching report details:", error)
            setReport(null)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        )
    }

    if (!report) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Reporte no encontrado</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Status Badge */}
                    <View style={styles.statusContainer}>
                        <View style={[styles.badge, { backgroundColor: getStatusColor(report.status) }]}>
                            <Text style={styles.badgeText}>{getStatusText(report.status)}</Text>
                        </View>
                        <Text style={styles.date}>{new Date(report.created_at).toLocaleDateString()}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{report.title}</Text>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <MapPin size={18} color="#64748b" />
                        <Text style={styles.address}>{report.address}</Text>
                    </View>

                    {/* Images */}
                    {report.images && report.images.length > 0 && (
                        <View style={styles.imagesSection}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.imageScrollContent}
                                pagingEnabled
                            >
                                {report.images.map((img: string, index: number) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri: img }} style={styles.image} />
                                    </View>
                                ))}
                            </ScrollView>
                            {report.images.length > 1 && (
                                <Text style={styles.imageIndicator}>
                                    Desliza para ver más fotos
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Description Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Descripción</Text>
                        <Text style={styles.description}>{report.description}</Text>
                    </View>

                    {/* Details Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Detalles</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Categoría:</Text>
                            <Text style={styles.detailValue}>{report.categoryName || "General"}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Reportado por:</Text>
                            <Text style={styles.detailValue}>{report.userName || "Usuario"}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case "pending": return "#f59e0b"
        case "in_progress": return "#3b82f6"
        case "resolved": return "#10b981"
        case "rejected": return "#ef4444"
        default: return "#71717a"
    }
}

function getStatusText(status: string) {
    switch (status) {
        case "pending": return "Pendiente"
        case "in_progress": return "En Proceso"
        case "resolved": return "Resuelto"
        case "rejected": return "Rechazado"
        default: return status
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
    loadingText: {
        fontSize: 16,
        color: "#64748b",
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        padding: 20,
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    badgeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    date: {
        color: "#94a3b8",
        fontSize: 14,
        fontWeight: "500",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: 12,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginBottom: 24,
        backgroundColor: "#e2e8f0",
        alignSelf: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    address: {
        color: "#475569",
        fontSize: 14,
        fontWeight: "500",
    },
    imagesSection: {
        marginBottom: 24,
        alignItems: "center",
    },
    imageScrollContent: {
        gap: 16,
        paddingHorizontal: 10,
    },
    imageWrapper: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    image: {
        width: width - 80,
        height: 280,
        borderRadius: 20,
        backgroundColor: "#f1f5f9",
    },
    imageIndicator: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        paddingBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#475569",
        lineHeight: 26,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 15,
        color: "#64748b",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 15,
        color: "#0f172a",
        fontWeight: "600",
    },
})
