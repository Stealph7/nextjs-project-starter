"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"

const regions = [
  "Lagunes",
  "Haut-Sassandra",
  "Savanes",
  "Vallée du Bandama",
  "Moyen-Comoé",
  "18 Montagnes",
  "Lacs",
  "Zanzan",
  "Bas-Sassandra",
  "Denguélé",
  "N'zi-Comoé",
  "Marahoué",
  "Sud-Comoé",
  "Worodougou",
  "Sud-Bandama",
  "Agnéby-Tiassa",
  "Bafing",
  "Fromager",
  "Moyen-Cavally",
]

const cultures = [
  "Riz",
  "Maïs",
  "Manioc",
  "Igname",
  "Banane plantain",
  "Cacao",
  "Café",
  "Coton",
  "Anacarde",
  "Mangue",
  "Ananas",
  "Légumes",
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    region: "",
    address: "",
    cultures: [] as string[],
    bio: "",
    photoUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil")
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("photo", file)

    try {
      const response = await fetch("/api/user/profile/photo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement de la photo")
      }

      const { photoUrl } = await response.json()
      setProfileData((prev) => ({ ...prev, photoUrl }))

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profil Producteur</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo de profil */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Photo de profil
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                {profileData.photoUrl ? (
                  <img
                    src={profileData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Photo
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <Input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Région
              </label>
              <Select
                value={profileData.region}
                onValueChange={(value) =>
                  setProfileData((prev) => ({ ...prev, region: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <Textarea
                value={profileData.address}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cultures pratiquées
              </label>
              <Select
                value={profileData.cultures[0]}
                onValueChange={(value) =>
                  setProfileData((prev) => ({ ...prev, cultures: [...prev.cultures, value] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez vos cultures" />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map((culture) => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileData.cultures.map((culture) => (
                  <span
                    key={culture}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {culture}
                    <button
                      type="button"
                      onClick={() =>
                        setProfileData((prev) => ({
                          ...prev,
                          cultures: prev.cultures.filter((c) => c !== culture),
                        }))
                      }
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 text-green-400 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <Textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="mt-1"
                placeholder="Parlez-nous de votre exploitation..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
