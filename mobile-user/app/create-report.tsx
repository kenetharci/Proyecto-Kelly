import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import { Camera, X } from "lucide-react-native"
import Constants from "expo-constants"

const CATEGORIES = [
    { id: 1, name: "Basuras" },
    { id: 2, name: "Iluminación" },
    { id: 3, name: "Vías" },
    { id: 4, name: "Seguridad" },
    { id: 5, name: "Parques" },
    { id: 6, name: "Agua" },
    { id: 7, name: "Alcantarillado" },
    { id: 8, name: "Otro" },
]

export default function CreateReport() {
    const router = useRouter()
    const [contactName, setContactName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [description, setDescription] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState<Location.LocationObject | null>(null)
    const [address, setAddress] = useState<string>("Obteniendo ubicación...")
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.20.56:3000"

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setErrorMsg("Permiso de ubicación denegado")
                setAddress("Ubicación no disponible")
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setLocation(location)

            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })

            if (reverseGeocode.length > 0) {
                const addr = reverseGeocode[0]
                setAddress(`${addr.street || ""} ${addr.streetNumber || ""}, ${addr.city || ""}`)
            } else {
                setAddress(`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`)
            }
        })()
    }, [])

    const pickImage = async () => {
        if (images.length >= 3) {
            Alert.alert("Límite alcanzado", "Solo puedes subir hasta 3 imágenes")
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        })

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri])
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const uploadImage = async (uri: string) => {
        const formData = new FormData()
        // @ts-ignore
        formData.append("image", {
            uri,
            name: `photo_${Date.now()}.jpg`,
            type: "image/jpeg",
        })

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (!response.ok) throw new Error("Failed to upload image")

            const data = await response.json()
            return data.url
        } catch (error) {
            console.error("Error uploading image:", error)
            throw error
        }
    }

    const handleSubmit = async () => {
        if (!contactName || !contactEmail || !contactPhone || !description || !selectedCategory) {
            Alert.alert("Error", "Por favor completa todos los campos obligatorios")
            return
        }

        setLoading(true)
        try {
            const userStr = await AsyncStorage.getItem("user")
            const token = await AsyncStorage.getItem("token")

            if (!userStr || !token) {
                Alert.alert("Error", "No se encontró información del usuario. Por favor inicia sesión nuevamente.")
                setLoading(false)
                return
            }

            const user = JSON.parse(userStr)

            // Upload images first
            const uploadedImageUrls = []
            for (const uri of images) {
                try {
                    const serverUrl = await uploadImage(uri)
                    uploadedImageUrls.push(serverUrl)
                } catch (error) {
                    console.error("Failed to upload image:", uri)
                    // Continue with other images or fail? Let's continue but warn
                }
            }

            const reportData = {
                userId: user.id,
                categoryId: selectedCategory,
                title: `Reporte de ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`,
                description,
                contactName: contactName,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                address: address,
                latitude: location?.coords.latitude || 0,
                longitude: location?.coords.longitude || 0,
                imageUrls: uploadedImageUrls,
            }

            console.log("Sending report:", reportData)

            const response = await fetch(`${API_URL}/api/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reportData),
            })

            console.log("Response status:", response.status)

            if (response.ok) {
                const savedReport = await response.json()
                console.log("Report saved:", savedReport)

                // Update local storage for immediate feedback if needed, 
                // but ideally we should rely on fetching from backend in the list view
                const reportKey = `reports_${user.id}`
                const existingReportsStr = await AsyncStorage.getItem(reportKey)
                const existingReports = existingReportsStr ? JSON.parse(existingReportsStr) : []

                const localReport = {
                    ...savedReport,
                    category: CATEGORIES.find(c => c.id === selectedCategory)?.name || "",
                }

                const updatedReports = [localReport, ...existingReports]
                await AsyncStorage.setItem(reportKey, JSON.stringify(updatedReports))

                Alert.alert("Éxito", "Reporte creado correctamente", [
                    { text: "OK", onPress: () => router.replace("/(tabs)/home") }
                ])
            } else {
                const errorText = await response.text()
                console.error("Error response:", errorText)
                try {
                    const error = JSON.parse(errorText)
                    Alert.alert("Error", error.message || error.error || "No se pudo crear el reporte")
                } catch {
                    Alert.alert("Error", `Error del servidor (${response.status})`)
                }
            }

        } catch (error) {
            console.error("Error creating report:", error)
            Alert.alert("Error", "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nuevo Reporte</Text>
                    <Text style={styles.subtitle}>Cuéntanos qué está pasando</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información de Contacto</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={contactName}
                                onChangeText={setContactName}
                                placeholder="Tu nombre"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={contactEmail}
                                onChangeText={setContactEmail}
                                placeholder="tu@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Teléfono</Text>
                            <TextInput
                                style={styles.input}
                                value={contactPhone}
                                onChangeText={setContactPhone}
                                placeholder="+57 300..."
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Detalles del Reporte</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Categoría</Text>
                            <View style={styles.categoriesGrid}>
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategory === cat.id && styles.categoryChipSelected,
                                        ]}
                                        onPress={() => setSelectedCategory(cat.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                selectedCategory === cat.id && styles.categoryTextSelected,
                                            ]}
                                        >
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe el problema detalladamente..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ubicación</Text>
                            <Text style={styles.locationText}>{errorMsg || address}</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Fotos ({images.length}/3)</Text>
                            <View style={styles.imagesContainer}>
                                {images.map((uri, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri }} style={styles.imageThumbnail} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <X size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {images.length < 3 && (
                                    <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                                        <Camera size={24} color="#71717a" />
                                        <Text style={styles.addImageText}>Agregar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar Reporte"}</Text>
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
    },
    header: {
        marginBottom: 24,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0a0a0a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#71717a",
    },
    form: {
        gap: 24,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0a0a0a",
        marginBottom: 8,
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
        backgroundColor: "#fff",
    },
    textArea: {
        minHeight: 100,
    },
    locationText: {
        fontSize: 14,
        color: "#71717a",
        padding: 12,
        backgroundColor: "#f4f4f5",
        borderRadius: 8,
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f4f4f5",
        borderWidth: 1,
        borderColor: "#e4e4e7",
    },
    categoryChipSelected: {
        backgroundColor: "#dcfce7",
        borderColor: "#16a34a",
    },
    categoryText: {
        fontSize: 14,
        color: "#71717a",
    },
    categoryTextSelected: {
        color: "#15803d",
        fontWeight: "600",
    },
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    imageWrapper: {
        position: "relative",
        width: 100,
        height: 100,
    },
    imageThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "#ef4444",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#e4e4e7",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fafafa",
    },
    addImageText: {
        fontSize: 12,
        color: "#71717a",
        marginTop: 4,
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
})
