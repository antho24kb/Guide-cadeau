# Mémoire commune Radar Steelbook

Cette mémoire est lue et mise à jour par toutes les IA qui travaillent sur Radar Steelbook (ChatGPT, Claude). Elle remplace la mémoire des conversations : une IA qui démarre une session ne sait rien, elle lit d'abord ce dossier.

## Avant de commencer (obligatoire)
Lire dans cet ordre : `PROJET.md` → `REGLES.md` → `TACHES.md` → les 10 dernières lignes de `JOURNAL.md`.

## Rôles
- **Antho** : donne les objectifs, les liens Amazon, valide et fusionne les changements finaux ; publie lui-même sur TikTok et envoie lui-même les mails.
- **ChatGPT, directeur** : analyse, priorise, répartit les tâches, crée une branche `radar-task/<date>-<slug>` et une PR avec une seule nouvelle consigne dans `TACHES.md`, puis relit le résultat avec la checklist qualité.
- **Claude, développeur** : le workflow GitHub lance Claude automatiquement sur la PR de tâche ; Claude modifie les pages ou prépare les contenus dans cette branche, puis coche la tâche faite dans `TACHES.md` et ajoute une ligne datée dans `JOURNAL.md`.
- **Contrôle qualité** : ChatGPT relit le travail de Claude avec `CHECKLIST_QUALITE.md` avant de le présenter à Antho pour validation.

## Fonctionnement automatique
1. Antho demande une tâche à ChatGPT.
2. ChatGPT crée une branche `radar-task/<date>-<slug>` et une PR contenant une seule nouvelle ligne non cochée dans `TACHES.md`.
3. Le workflow `.github/workflows/claude-task-runner.yml` démarre Claude si la PR vient du même dépôt, utilise cette branche dédiée et contient exactement une nouvelle tâche non cochée. Les PR de forks et les autres branches ne lancent pas Claude.
4. Claude travaille sur la branche de la PR. Il ne fusionne rien et ne publie pas le site.
5. ChatGPT contrôle le résultat ; Antho valide et fusionne la PR. La publication du site ne se produit qu'après fusion, selon la configuration Pages du dépôt.

Chaque tâche reste limitée à une seule consigne. Si Claude a besoin d'une décision d'Antho, d'un accès à un compte ou d'un secret manquant, il laisse la tâche non cochée et le signale dans la PR. Antho reste responsable de la publication TikTok et de l'envoi des e-mails.

## Configuration unique requise
Installer l’application officielle [Claude pour GitHub](https://github.com/apps/claude) sur ce dépôt, puis ajouter **un seul** secret Actions : `ANTHROPIC_API_KEY` ou `CLAUDE_CODE_OAUTH_TOKEN`. Ne jamais coller la valeur dans un fichier du dépôt ni dans une conversation. L'usage de l'API Anthropic peut être facturé selon le compte et le mode d'authentification.

## Règles de fonctionnement
1. Une seule consigne par PR, écrite dans `TACHES.md` avec responsable, échéance et critère de fin.
2. Après chaque tâche terminée : cocher la tâche et ajouter une ligne datée dans `JOURNAL.md`.
3. Ne jamais supprimer une règle de `REGLES.md` sans qu'Antho l'ait demandé. En cas de doute, demander à Antho.
4. Toujours récupérer la dernière version du dépôt avant de modifier un fichier.
5. **Le dépôt est public** : jamais de mot de passe, clé, e-mail, chiffre d'affaires ni donnée personnelle dans ce dossier.

Lien direct pour ChatGPT (lecture brute) : https://raw.githubusercontent.com/antho24kb/guide-cadeau/main/memoire/LISEZ-MOI.md
