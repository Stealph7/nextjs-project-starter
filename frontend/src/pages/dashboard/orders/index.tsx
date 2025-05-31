"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { useToast } from "../../../components/ui/use-toast"
import { formatDate, formatPrice } from "../../../lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

interface Order {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  quantity: number
  totalPrice: number
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: string
  product: {
    name: string
    unit: string
    photos: string[]
  }
  buyer: {
    name: string
    email: string
  }
  seller: {
    name: string
    email: string
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Erreur lors du chargement des commandes")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du statut")

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      )

      toast({
        title: "Succès",
        description: "Le statut de la commande a été mis à jour",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    }
  }

  const salesOrders = orders.filter((order) => order.sellerId === user?.id)
  const purchaseOrders = orders.filter((order) => order.buyerId === user?.id)

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 relative">
          {order.product.photos[0] ? (
            <img
              src={order.product.photos[0]}
              alt={order.product.name}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
              Photo
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{order.product.name}</h3>
          <div className="text-sm text-gray-500">
            {order.quantity} {order.product.unit} • {formatPrice(order.totalPrice)}
          </div>
          <div className="text-sm text-gray-500">
            {order.sellerId === user?.id
              ? `Acheteur: ${order.buyer.name}`
              : `Vendeur: ${order.seller.name}`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </div>
          <div
            className={`mt-1 inline-flex px-2 py-1 text-xs rounded-full ${
              order.status === "completed"
                ? "bg-green-100 text-green-800"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status === "completed"
              ? "Terminée"
              : order.status === "pending"
              ? "En attente"
              : order.status === "rejected"
              ? "Refusée"
              : "Acceptée"}
          </div>
        </div>
      </div>

      {order.sellerId === user?.id && order.status === "pending" && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus(order.id, "rejected")}
          >
            Refuser
          </Button>
          <Button onClick={() => handleUpdateStatus(order.id, "accepted")}>
            Accepter
          </Button>
        </div>
      )}

      {order.sellerId === user?.id && order.status === "accepted" && (
        <div className="flex justify-end">
          <Button onClick={() => handleUpdateStatus(order.id, "completed")}>
            Marquer comme terminée
          </Button>
        </div>
      )}
    </Card>
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases">Mes achats</TabsTrigger>
          <TabsTrigger value="sales">Mes ventes</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">Vous n'avez pas encore effectué d'achats</p>
            </Card>
          ) : (
            purchaseOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {salesOrders.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">Vous n'avez pas encore de ventes</p>
            </Card>
          ) : (
            salesOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
