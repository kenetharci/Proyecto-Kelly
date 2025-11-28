"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { User, Mail, Phone, Lock, LogOut, CreditCard } from "lucide-react-native"

export default function Profile() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [modalVisible, setModalVisible] = useState(false)

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async () => {
        try {
            const userStr = await AsyncStorage.getItem("user")
            if (userStr) {
                setUser(JSON.parse(userStr))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("user")
            router.replace("/login")
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Por favor completa todos los campos")
            return
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Las nuevas contraseñas no coinciden")
            return
        }

        setLoading(true)
        try {
            // Verify current password
            // In a real app, this would be an API call. 
            // Here we check against the stored user object (simulating auth check)

            if (user.password !== currentPassword) {
                Alert.alert("Error", "La contraseña actual es incorrecta")
                setLoading(false)
                return
            }

            // Update password
            const updatedUser = { ...user, password: newPassword }
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

            // Also update in the users list if we were simulating a database
            const usersStr = await AsyncStorage.getItem("users")
            if (usersStr) {
                const users = JSON.parse(usersStr)
                const updatedUsers = users.map((u: any) =>
                    u.email === user.email ? updatedUser : u
                )
                await AsyncStorage.setItem("users", JSON.stringify(updatedUsers))
            }

            setUser(updatedUser)
            setModalVisible(false)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            Alert.alert("Éxito", "Contraseña actualizada correctamente")

        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar la contraseña")
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text>Cargando perfil...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </Text>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.role}>Ciudadano</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Mail size={20} color="#71717a" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <Phone size={20} color="#71717a" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Teléfono</Text>
                        <Text style={styles.value}>{user.phone || "No registrado"}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <CreditCard size={20} color="#71717a" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.label}>Cédula</Text>
                        <Text style={styles.value}>{user.cedula || "No registrada"}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seguridad</Text>

                <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                    <View style={styles.iconContainer}>
                        <Lock size={20} color="#71717a" />
                    </View>
                    <Text style={styles.actionText}>Cambiar Contraseña</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Contraseña Actual</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                placeholder="Ingresa tu contraseña actual"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                placeholder="Ingresa la nueva contraseña"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Confirma la nueva contraseña"
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleChangePassword}
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>{loading ? "Guardando..." : "Guardar"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f5",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e4e4e7",
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#16a34a",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0a0a0a",
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: "#71717a",
    },
    section: {
        backgroundColor: "#fff",
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e4e4e7",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0a0a0a",
        marginBottom: 16,
        marginTop: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f4f4f5",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f4f4f5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#71717a",
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: "#0a0a0a",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    actionText: {
        fontSize: 16,
        color: "#0a0a0a",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fee2e2",
        margin: 20,
        padding: 16,
        borderRadius: 8,
        gap: 8,
    },
    logoutText: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0a0a0a",
        marginBottom: 20,
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#0a0a0a",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e4e4e7",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f4f4f5",
    },
    saveButton: {
        backgroundColor: "#16a34a",
    },
    cancelButtonText: {
        color: "#71717a",
        fontWeight: "600",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
})
