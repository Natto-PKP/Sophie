## NOTES POUR PLUS TARD

- Faire un genre de jeu avec des éléments (proposer des quêtes spécialiser dans l'élément de la classe du joueur), et des quêtes
- Faire un système de classe ou tout les joueurs partent d'une classe de base
- Ajouter des interactions dans la commande interact ??
- Ajouter plus de logs ??
- Ne pas faire de guilde de marchands et proposer directement le système de bourse
- Mettre le bot sur github

## CHANGEMENT EN COURS

## CHANGEMENT A PUSH

## PATCHS

> Un nouveau patch est créer une fois par semaine (Tout les vendredis si possible) (sauf si aucune avancée) avec toute les versions incluses dans cette semaine et envoyé dans le salon #patchs du serveur support Discord

### patch []

- [1.2.138] Ajout des logs guildCreate et guildRemove :: [CREATE] _guildCreate / Remove/log_
- [1.2.136] Correction sur le log message édité :: [UPDATE] _messageUpdate/log_
- [1.2.135] Création de la commande wallet basique :: [CREATE] _wallet_
- [1.2.134] Possibilité de changer les flags d'un utilisateur même si il n'est pas dans la base de données :: [UPDATE] _client alter flag_
- [1.2.133] Ajout d'une nouvelle canne à pêche
- [1.2.132] Ajout de la stat de cooldown et du cooldown un peu aléatoire sur la pêche :: [UPDATE] _work fishing_ / _shop tools_
- [1.2.130] Tout les poissons sont nommés
- [1.2.126] Ajout d'une condition oubliant les messages avec contenu identique :: [UPDATE] _messageUpdate/log_

### patch [11/10/2021]

- [1.2.125] Bandeaux de rang sur le profile :: [UPDATE] _profile_
- [1.2.124] Optimisation d'un fichier :: [UPDATE] _structures/databases_
- [1.2.123] Correction de fetch de salon de logs :: [UPDATE] _messageUpdate / Delete / guildBanAdd / Remove / guildMemberAdd / Remove/logs_
- [1.2.117] Correction des requêtes de logs :: [UPDATE] _messageUpdate / Delete/logs_
- [1.2.115] Précisez que seul les salons textuel sont possibe dans les commandes logs enable et logs edit :: [UPDATE] _guild logs edit/enable_
- [1.2.113] Ajout de l'intéraction "pat" et "punch" :: [UPDATE] _interact_ / _structures/interacts_
- [1.2.111] Optimisation de la commande de hug :: [UPDATE] _interact_ :: [CREATE] _structure/interacts_
- [1.2.109] Optimisation des commandes de commandes :: [UPDATE] _structure/names_ / _guild commands \*_
- [1.2.105] Amélioration du taux de drop de la canne par défaut, ajustement/correction des taux de drop sur les autres cannes et ajout d'un espace avant le tag nouveau :: [UPDATE] _work fishing_
- [1.2.104] Optimisation des commandes de logs, ajouts de logs :: [CREATE] _structure/names_ / _guildBanAdd / Remove/log_ / _messageUpdate / Delete/log_ :: [UPDATE] _guild logs \*_
- [1.2.94] Ajustement des probabilités sur la commande work fishing :: [UPDATE] _work fishing_
- [1.2.93] Mise à jour de la liste des logs actifs :: [UPDATE] _guild logs list_
- [1.2.92] Création de la commande de prévusialisation des logs :: [CREATE] _guild logs preview_ / _guildMemberAdd / Remove/log_
- [1.2.89] Update de la commande d'edit de log :: [UPDATE] _guild logs edit_
- [1.2.88] Changement du wallpapers par défault et de l'organisation des images :: [UPDATE] _wallpapers/\*guild-logs_ / _structure/images_ / _guildMemberAdd / Remove/log_
- [1.2.84] Correctif des caractères spéciaux sur le canvas sur le VPS :: [UPDATE] _strorage/fonts/Noto\*_ / _methods/Canvas_ / _guildMemberAdd / Remove/log_
- [1.2.74] Ajout des canvas pour les logs leave et join :: [UPDATE] _structure/images & icons_ / _guildMemberAdd & guildMemberRemove/log_ / _storage/icons/others/\*_ / _storage/images/wallpapers/logs/\*_ / _methods/Canvas_ / _storage/fonts/\*_
- [1.2.61] Afficher la première page dans les menus :: [UPDATE] _shop themes_
- [1.2.60] Vérifier si la dernière canne peut pecher 1 et pas que 2 :: [UPDATE] _work fishing_
- [1.2.59] Modification des choices des commandes enable et disable de guild commande en les rendant plus propre :: [UPDATE] _guild commands enable_ / _guild commands disable_
- [1.2.57] Ajout du proto Interaction.confirm :: [UPDATE] _methods/Discord_
- [1.2.56] Ajout de nouveaux logs: join et leave :: [CREATE] _events/guildMemberAdd/_ / _events/guildMemberRemove/_
- [1.2.54] Affichage des erreurs SQL lors d'une requête dans le salon d'erreurs :: [UPDATE] _structures/databases_ / _methods/Discord_ / _app_ / _structures/commands_
- [1.2.50] Création de la commande guild logs :: [CREATE] _guild \*logs_
- [1.2.46] Ajouter une condition qui return si la personne n'a rien dans l'indexes :: [UPDATE] _indexes fishs_
- [1.2.45] Corriger la mise en page quand l'outil est au max dans le shop ainsi que la description, tout les équipements doivent être débloquer avant? :: [UPDATE] _shop tools_
- [1.2.44] Retirer la possibilité d'utiliser la commande profile aux bots :: [UPDATE] _profile_
- [1.2.43] Création de la commande guild commands list :: [CREATE?] _guild commands list_
- [1.2.42] [RENAME] _server_ command [TO] _guild_ :: [UPDATE] _\*guild_
- [1.2.37] Ajouter et déplacer lovecalc dans les features et mise à jour du système de features :: [MOVE] _lovecalc_ [TO] _features_ :: [UPDATE] _server commands \*_ / _lovecalc_ / _avatar_ / _structures/flags_
- [1.2.30] Ajouter des nouveaux wallpapers dans la base de données :: [ADD] _michiru-basket_ / _arknight-ferrari_ / _arknight-rain_ / _miku-sleep_ / _sisters-war_
- [1.2.25] Ajouts de tags pour les wallpapers :: [ADD] _war_ / _sport_ :: [UPDATE] _shop themes_ / _inventory themes_
- [1.2.23] Refaire le typing des commandes client commands :: [UPDATE] _client commands_ / _client commands \*_
- [1.2.19] Refaire les commandes client alter :: [UPDATE] _client alter_ / _client alter \*_
- [1.2.12] Ajout d'une commande dans les features, donc update des commands de configuration :: [UPDATE] _structures/flags_ / _server commands \*_
- [1.2.10] Déplacement de la commande avatar dans les features :: [MOVE] [UPDATE] _avatar_ [TO] _features_
- [1.2.9] Suppression de la commande information :: [DELETE] _info_
- [1.2.8] Charger tout les fonds d'image directement au lancement du bot pour les utiliser dans les canvas pour que le tout soit plus rapide :: [UPDATE] _structures/images_ / _profile_
- [1.2.6] Changer l'affichage des conditions de déblocage sur la commande tools, afin de voir les étapes déjà faites :: [UPDATE] _shop tools_
- [1.2.5] Mettre un tag "new" a coté des nouveaux poissons péchés :: [UPDATE] _work fishing_
