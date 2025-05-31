"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto p-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Parcelles actives</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold">4</span>
            <span className="ml-2 text-sm text-green-500">+1 depuis le mois dernier</span>
          </div>
          <a href="#" className="text-sm text-green-600 mt-2 block hover:underline">
            Voir toutes les parcelles →
          </a>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Précipitations</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold">24 mm</span>
          </div>
          <span className="text-sm text-gray-500 block">Derniers 7 jours</span>
          <a href="#" className="text-sm text-green-600 mt-2 block hover:underline">
            Prévisions détaillées →
          </a>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Température</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold">28°C</span>
          </div>
          <span className="text-sm text-gray-500 block">Moyenne journalière</span>
          <a href="#" className="text-sm text-green-600 mt-2 block hover:underline">
            Tendance hebdomadaire →
          </a>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm text-gray-600">Humidité du sol</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold">65%</span>
          </div>
          <span className="text-sm text-gray-500 block">Optimal pour vos cultures</span>
          <a href="#" className="text-sm text-green-600 mt-2 block hover:underline">
            Détails par parcelle →
          </a>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="apercu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="cultures">Cultures</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WeatherCard />
            <CropsStatusCard />
            <AlertsCard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FinancialSummaryCard />
            <TasksCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WeatherCard() {
  const weatherData = [
    { day: "Aujourd'hui", weather: "Ensoleillé", temp: "28°C" },
    { day: "Demain", weather: "Partiellement nuageux", temp: "27°C" },
    { day: "Mercredi", weather: "Nuageux", temp: "26°C" },
    { day: "Jeudi", weather: "Bruine légère", temp: "25°C" },
    { day: "Vendredi", weather: "Pluie", temp: "24°C" },
  ]

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Météo</h3>
        <span className="text-sm text-gray-500">Prévisions pour Bouaké</span>
      </div>
      <div className="space-y-3">
        {weatherData.map((day) => (
          <div key={day.day} className="flex justify-between items-center">
            <span className="text-sm font-medium">{day.day}</span>
            <span className="text-sm text-gray-600">{day.weather}</span>
            <span className="text-sm">{day.temp}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CropsStatusCard() {
  const crops = [
    { name: "Maïs", progress: 65, status: "En croissance", daysToHarvest: 45 },
    { name: "Manioc", progress: 30, status: "Jeune plant", daysToHarvest: 120 },
    { name: "Riz", progress: 85, status: "Presque mûr", daysToHarvest: 15 },
  ]

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">État des cultures</h3>
      </div>
      <div className="space-y-4">
        {crops.map((crop) => (
          <div key={crop.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{crop.name}</span>
              <span className="text-sm text-gray-600">{crop.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${crop.progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">
              Récolte dans {crop.daysToHarvest} jours
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AlertsCard() {
  const alerts = [
    {
      type: "Alerte chenilles",
      description: "Risque élevé d'infestation sur maïs",
      time: "Aujourd'hui, 07:30",
      severity: "high",
    },
    {
      type: "Fortes pluies",
      description: "Prévision de 35mm dans les 24h",
      time: "Demain",
      severity: "medium",
    },
    {
      type: "Pic de chaleur",
      description: "Températures >32°C prévues",
      time: "Mercredi",
      severity: "low",
    },
  ]

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Alertes récentes</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.type} className="flex items-start space-x-3">
            <div className={`w-2 h-2 mt-2 rounded-full bg-${alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'yellow' : 'blue'}-500`} />
            <div>
              <h4 className="font-medium">{alert.type}</h4>
              <p className="text-sm text-gray-600">{alert.description}</p>
              <span className="text-sm text-gray-500">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FinancialSummaryCard() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Résumé financier</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm text-gray-600">Revenus (mois)</h4>
          <div className="text-2xl font-semibold">1.250.000 FCFA</div>
          <span className="text-sm text-green-500">+12% par rapport au mois dernier</span>
        </div>
        <div>
          <h4 className="text-sm text-gray-600">Dépenses (mois)</h4>
          <div className="text-2xl font-semibold">450.000 FCFA</div>
          <span className="text-sm text-red-500">+8% par rapport au mois dernier</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Prêt en cours</span>
          <span>350.000 FCFA</span>
        </div>
        <div className="flex justify-between">
          <span>Prochain paiement</span>
          <span>15 Mai 2025</span>
        </div>
        <div className="flex justify-between">
          <span>Montant à payer</span>
          <span>35.000 FCFA</span>
        </div>
      </div>
    </Card>
  )
}

function TasksCard() {
  const tasks = [
    {
      title: "Application d'engrais",
      location: "Parcelle de maïs - Secteur Nord",
      date: "Aujourd'hui",
      time: "14:00",
      priority: "urgent",
    },
    {
      title: "Inspection des plants de manioc",
      location: "Vérifier signes de maladie",
      date: "Demain",
      time: "09:30",
      priority: "important",
    },
    {
      title: "Récolte de riz",
      location: "Parcelle Est - 2 hectares",
      date: "30 Avril",
      time: "07:00",
      priority: "urgent",
    },
    {
      title: "Maintenance du système d'irrigation",
      location: "Vérifier les tuyaux et les pompes",
      date: "2 Mai",
      time: "10:00",
      priority: "normal",
    },
  ]

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Tâches à venir</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-start space-x-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.location}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">{task.date}</span>
                <span className="text-sm text-gray-500">{task.time}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  task.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
