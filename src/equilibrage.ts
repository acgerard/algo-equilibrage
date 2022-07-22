export type Livraison = {
    date: number
    lockers: number
    places: RepartitionPointRelais
}

export type Decalage = {
    nb: number // si > 0 récupère un décalage d'une livraison voisine, sinon décale vers une livraison voisine
    repartitionPtRelais: RepartitionPointRelais // repartition du decalage
}

type RepartitionPointRelais = { [id: string]: number }

export type LivraisonEquilibree = {
    livraison: Livraison
    decalageAvant: Decalage
    decalageApres: Decalage
}

export function equilibrageLivraisons(livraisons: Livraison[]): Livraison[] {
    // si moins de deux semaines -> rien à équilibrer
    if (livraisons.length <= 1) {
        return livraisons
    }

    const livraisonsEquilibrees: LivraisonEquilibree[] = livraisons.map(livraison => {
        return {
            livraison: livraison,
            decalageApres: {nb: 0, repartitionPtRelais: {}},
            decalageAvant: {nb: 0, repartitionPtRelais: {}}
        }
    })
    // sort sur la date -> on veut par ordre chronologique: le premier est le plus ancien, le dernier le plus récent
    livraisonsEquilibrees.sort((a, b) => a.livraison.date - b.livraison.date)


    const nbLivraisons = livraisons.length
    const nbCasiersTotal = livraisons.reduce((previousValue, currentValue) => previousValue + currentValue.lockers, 0)
    const nbCasiersMoyen = Math.ceil(nbCasiersTotal / nbLivraisons)

    // parcours des livraisons en partant de la plus récente
    for (let i = 0; i < nbLivraisons; i++) {
        const livraison = livraisonsEquilibrees[i]
        const livraisonPrecedente = i === 0 ? null : livraisonsEquilibrees[i - 1]

        // si nb casiers de la livraison <= nb casiers moyen -> on ne décale rien du tout
        if (livraison.livraison.lockers > nbCasiersMoyen) {
            const livraisonSuivante = i === nbLivraisons - 1 ? null : livraisonsEquilibrees[i + 1]

            let nbCasiers = livraison.livraison.lockers

            const nbCasiersSuivant = !!livraisonSuivante ? getNbCasiers(livraisonSuivante) : nbCasiersMoyen
            const nbCasiersPrecedent = !!livraisonPrecedente ? getNbCasiers(livraisonPrecedente) : nbCasiersMoyen

            if (!!livraisonPrecedente && nbCasiersPrecedent < nbCasiersMoyen ) {
                // on décale sur la livraison précédente
                const decalage = Math.min(nbCasiersMoyen - nbCasiersPrecedent, nbCasiers - nbCasiersMoyen)
                livraison.decalageAvant.nb = -decalage
                livraisonPrecedente.decalageApres.nb = decalage
                nbCasiers -= decalage
            }

            // si il y a encore des casiers à décaler et que la livraison suivante peut en receptionner
            if (nbCasiers > nbCasiersMoyen && !!livraisonSuivante && nbCasiersSuivant < nbCasiersMoyen) {
                // on décale des casiers dans la livraison suivante
                const decalage = Math.min(nbCasiersMoyen - nbCasiersSuivant, nbCasiers - nbCasiersMoyen)
                livraison.decalageApres.nb = -decalage
                livraisonSuivante.decalageAvant.nb = decalage
            }

        }

        // calcule de la répartition du décalage sur la livraison precedente
        if (!!livraisonPrecedente) {

            if(livraison.decalageAvant.nb < 0) {
                // decalage de cette livraison vers le passé
                const repartitionDecalagePrecedent = equilibragePtRelais(livraison.livraison.lockers, livraison.livraison.places, livraison.decalageAvant.nb)
                livraison.decalageAvant.repartitionPtRelais = repartitionDecalagePrecedent
                // on inverse le signe de la repartition
                livraisonPrecedente.decalageApres.repartitionPtRelais = repartitionOpposee(repartitionDecalagePrecedent)
            } else {
                // decalage de la livraison d'avant vers la courante
                // on calcule en fait la repartition vers le futur de la livraison précédente
                const repartitionDecalagePrecedent = equilibragePtRelais(livraisonPrecedente.livraison.lockers, livraisonPrecedente.livraison.places, livraisonPrecedente.decalageApres.nb)
                livraisonPrecedente.decalageApres.repartitionPtRelais = repartitionDecalagePrecedent
                // on inverse le signe de la repartition
                livraison.decalageAvant.repartitionPtRelais = repartitionOpposee(repartitionDecalagePrecedent)
            }

        }
    }

    return livraisonsEquilibrees.map(l => {
        return {
            lockers: getNbCasiers(l),
            date: l.livraison.date,
            places: getRepartition(l)
        }
    })
}

function getNbCasiers(livraison: LivraisonEquilibree): number {
    return livraison.livraison.lockers + livraison.decalageAvant.nb + livraison.decalageApres.nb
}

function getRepartition(livraison: LivraisonEquilibree): RepartitionPointRelais {
    const repartition: RepartitionPointRelais = livraison.livraison.places
    Object.keys(repartition).forEach(id => {
        repartition[id] += (livraison.decalageAvant.repartitionPtRelais[id] || 0) + (livraison.decalageApres.repartitionPtRelais[id] || 0)
    })
    return repartition
}

function repartitionOpposee(repartition: RepartitionPointRelais): RepartitionPointRelais {
    const repartitionOpposee = {} as RepartitionPointRelais
    Object.keys(repartition).forEach(id => repartitionOpposee[id] = -repartition[id])
    return repartitionOpposee
}

function equilibragePtRelais(nbCasiersInitial: number, repartitionInitiale: RepartitionPointRelais, decalage: number): RepartitionPointRelais {
    // pas de decalage -> aucune equilibrage des pt relais
    if (decalage === 0) {
        return {}
    }

    const repartition: RepartitionPointRelais = {}

    // premiere étape -> décalage au prorata des points relais
    const ratio = Math.abs(decalage) / nbCasiersInitial
    let sommeDecalages = 0
    Object.keys(repartitionInitiale).forEach(id => {
        let decalage = Math.trunc(ratio * repartitionInitiale[id]);
        if (decalage > 0) {
            repartition[id] = -decalage
            sommeDecalages += decalage
        }
    })

    // repartition du reste à décaler
    const decalageRestant = Math.abs(decalage) - sommeDecalages
    let nbPointsRelaisToChange = Object.keys(repartition).length;
    const decalageToAddToEach = Math.trunc(decalageRestant / nbPointsRelaisToChange)
    const decalageSurplus = decalageRestant % nbPointsRelaisToChange
    Object.keys(repartition).forEach((id, index) => {
        repartition[id] -= decalageToAddToEach + (index < decalageSurplus ? 1 : 0)
    })

    return repartition
}

