"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import Constants from "expo-constants"

export default function Register() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [cedula, setCedula] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.20.56:3000"

    const handleRegister = async () => {
        if (!name || !phone || !email || !cedula || !password || !confirmPassword) {
            Alert.alert("Error", "Por favor completa todos los campos")
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden")
            return
        }

        setLoading(true)
        try {
            // Note: This endpoint needs to be implemented on the backend to handle 'cedula' and 'name'
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    cedula,
                    password,
                    role: "user"
                }),
            })

            const data = await response.json()

            if (response.ok) {
                Alert.alert("Éxito", "Usuario registrado correctamente", [
                    { text: "OK", onPress: () => router.back() }
                ])
            } else {
                Alert.alert("Error", data.message || "Error al registrar usuario")
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Registro</Text>
                    <Text style={styles.subtitle}>Crea tu cuenta para empezar</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Juan Pérez"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+57 300 123 4567"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cédula</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1234567890"
                            value={cedula}
                            onChangeText={setCedula}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Registrando..." : "Registrarse"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.link}>¿Ya tienes cuenta? Inicia Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 24,
        justifyContent: "center",
    },
    header: {
        marginBottom: 32,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#0a0a0a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#71717a",
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#0a0a0a",
    },
    input: {
        borderWidth: 1,
        borderColor: "#e4e4e7",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#16a34a",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        color: "#16a34a",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 20,
    },
})
