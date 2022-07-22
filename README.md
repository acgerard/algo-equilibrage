# algo-equilibrage

Implémentation de l'algorithme d'équilibrage de casiers.

## Description

**Hypothèses**:
- Chaque livraison a tous les points relais de livraison (éventuellement à 0 si aucune livraison prévue à une date donnée à un point relais)
- Pour minimiser les décalages, les décalages ne se font qu'entre livraisons voisines

L'algorithme implémenté :
- calcule le nombre moyen de paniers (nb total paniers / nb semaines, tronqué à l'entier supérieur pour déplacer le moins de paniers possibles)
- ordonne les livraisons par ordre chronologique (la plus ancienne d'abord)
- parcourt les livraisons
  - si cette livraison a plus de casiers que la moyenne alors
    - décale vers l'arrière (passé) si le nb de casiers précédent est < moyenne
    - décale vers l'avant (futur), si le nb de casiers suivant est < moyenne
  - equilibre ensuite les paniers dans les points relais en calculant le décalage de répartition vers la livraison precedente
    - dans un premier temps au prorata de la répartition des paniers
    - puis ce qui reste, réparti un à un


## Launch

Les tests peuvent être lancés avec un
```
npm run test
```