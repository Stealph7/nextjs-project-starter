"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    name: string
    email: string
  }
}

interface Contact {
  id: string
  name: string
  email: string
  lastMessage?: string
  lastMessageDate?: string
  unreadCount: number
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id)
    }
  }, [selectedContact])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/messages/contacts")
      if (!response.ok) throw new Error("Erreur lors du chargement des contacts")
      const data = await response.json()
      setContacts(data)
      if (data.length > 0 && !selectedContact) {
        setSelectedContact(data[0])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (contactId: string) => {
    try {
      const response = await fetch(`/api/messages/${contactId}`)
      if (!response.ok) throw new Error("Erreur lors du chargement des messages")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      })
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContact || !newMessage.trim()) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'envoi du message")

      const message = await response.json()
      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                lastMessage: newMessage,
                lastMessageDate: new Date().toISOString(),
              }
            : contact
        )
      )
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="h-[600px] flex items-center justify-center">
          <div className="text-center">Chargement...</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="h-[600px] grid grid-cols-4">
        {/* Contacts List */}
        <div className="border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <ScrollArea className="h-[calc(600px-65px)]">
            <div className="divide-y">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {contact.lastMessage}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {contact.lastMessageDate && (
                        <div className="text-xs text-gray-500">
                          {formatDate(contact.lastMessageDate)}
                        </div>
                      )}
                      {contact.unreadCount > 0 && (
                        <div className="mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages */}
        <div className="col-span-3 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedContact.name}</h3>
                <div className="text-sm text-gray-500">{selectedContact.email}</div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.senderId === user?.id
                              ? "text-green-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Envoyer
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionnez un contact pour commencer une conversation
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
