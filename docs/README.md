# AgriConnect

AgriConnect est une plateforme innovante conçue pour connecter les agriculteurs et les acheteurs, tout en fournissant des outils de gestion agricole essentiels.

## Structure du Projet

```
/AgriConnect-CI
│
├── /frontend                 # Application Next.js
│   ├── /public              # Fichiers statiques
│   ├── /src                 # Code source
│   │   ├── /components      # Composants React réutilisables
│   │   ├── /pages          # Pages de l'application
│   │   ├── /assets         # Images, fonts, etc.
│   │   └── /styles         # Fichiers CSS et styles
│   └── package.json
│
├── /backend                 # API Laravel
│   ├── /app                # Code source principal
│   │   ├── /Http          # Controllers et Middleware
│   │   ├── /Models        # Modèles Eloquent
│   │   └── /Services      # Services métier
│   ├── /database          # Migrations et seeds
│   └── /routes            # Définitions des routes API
│
└── /docs                   # Documentation
```

## Fonctionnalités Principales

1. **Gestion des Cultures**
   - Suivi des parcelles
   - Planification des cultures
   - Surveillance météorologique

2. **Marketplace**
   - Liste des produits
   - Système de commande
   - Gestion des transactions

3. **Tableau de Bord**
   - Statistiques en temps réel
   - Alertes et notifications
   - Gestion financière

4. **Communication**
   - Messagerie interne
   - Notifications
   - Partage d'informations

## Installation

### Prérequis
- PHP >= 8.1
- Node.js >= 16
- MySQL >= 8.0

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
