"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  unit: string
  photos: string[]
  status: "available" | "low_stock" | "out_of_stock"
  createdAt: string
  views: number
  contacts: number
  sales: number
}

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/my")
      if (!response.ok) throw new Error("Erreur lors du chargement des annonces")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos annonces",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast({
        title: "Annonce supprimée",
        description: "L'annonce a été supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Annonces</h1>
          <Button disabled>Chargement...</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Annonces</h1>
        <Link href="/dashboard/products/new">
          <Button>
            <span className="mr-2">+</span> Nouvelle annonce
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore d'annonces</p>
          <Link href="/dashboard/products/new">
            <Button>Créer votre première annonce</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48">
                {product.photos[0] ? (
                  <img
                    src={product.photos[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    Pas de photo
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === "available"
                      ? "bg-green-100 text-green-800"
                      : product.status === "low_stock"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.status === "available"
                      ? "Disponible"
                      : product.status === "low_stock"
                      ? "Stock faible"
                      : "Épuisé"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  {product.quantity} {product.unit} - {product.price.toLocaleString()} FCFA/{product.unit}
                </p>

                <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
                  <div className="text-center">
                    <div className="font-semibold">{product.views}</div>
                    <div>Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{product.contacts}</div>
                    <div>Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{product.sales}</div>
                    <div>Ventes</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
