# 1. Créer une catégorie
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"NodeJS","description":"Articles sur NodeJS"}'

# 2. Créer un article
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":      "Apprendre NodeJS en 100 projets",
    "content":    "NodeJS est un runtime JavaScript...",
    "excerpt":    "Guide complet pour maîtriser NodeJS",
    "categoryId": "ID_CATEGORIE_ICI",
    "author":     "Harry Mezui",
    "tags":       ["nodejs","typescript"]
  }'

# 3. Publier l'article
curl -X PATCH http://localhost:3000/api/posts/{id}/publish

# 4. Lire par slug (incrémente les vues)
curl http://localhost:3000/api/posts/slug/apprendre-nodejs-en-100-projets

# 5. Ajouter un commentaire
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "postId":  "ID_POST_ICI",
    "author":  "Alice",
    "email":   "alice@example.com",
    "content": "Super article !"
  }'

# 6. Approuver le commentaire
curl -X PATCH http://localhost:3000/api/comments/{id}/approve

# 7. Stats
curl http://localhost:3000/api/posts/stats