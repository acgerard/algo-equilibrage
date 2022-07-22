import {equilibrageLivraisons, Livraison} from "./equilibrage";


describe('Algorithme d\'équilibrage :', function () {
    it("sur une semaine -> rien à équilibrer, retourne l'entrée", function () {
        // GIVEN
        const livraisons: Livraison[] = [{
            date: 20220404,
            lockers: 45,
            places: {a: 20, b: 15, c: 10}
        }]

        // WHEN
        const livraisonsEquilibrees = equilibrageLivraisons(livraisons)

        // then
        expect(livraisonsEquilibrees).toHaveLength(1)
        expect(livraisonsEquilibrees[0]).toEqual(livraisons[0])
    })
    it("avec livraisons non ordonnées par date en entrée -> les ordonne", function () {
        // GIVEN
        const livraisons: Livraison[] = [{
            date: 20220411,
            lockers: 45,
            places: {a: 20, b: 15, c: 10}
        },
            {
                date: 20220404,
                lockers: 29,
                places: {a: 10, b: 10, c: 9}
            }]

        // WHEN
        const livraisonsEquilibrees = equilibrageLivraisons(livraisons)

        // then
        expect(livraisonsEquilibrees).toHaveLength(2)
        expect(livraisonsEquilibrees[0].date).toEqual(livraisons[1].date)
        expect(livraisonsEquilibrees[1].date).toEqual(livraisons[0].date)
        expect(livraisonsEquilibrees[0].lockers).toEqual(37)
        expect(livraisonsEquilibrees[1].lockers).toEqual(37)
    })
    it("cas nominal sur 4 semaines", function () {
        // GIVEN
        const livraisons: Livraison[] = [{
            date: 20220404,
            lockers: 45,
            places: {a: 20, b: 15, c: 10}
        }, {
            date: 20220411,
            lockers: 29,
            places: {a: 10, b: 10, c: 9}
        }, {
            date: 20220418,
            lockers: 70,
            places: {a: 30, b: 20, c: 20}
        }, {
            date: 20220425,
            lockers: 20,
            places: {a: 5, b: 10, c: 5}
        }]

        // WHEN
        const livraisonsEquilibrees = equilibrageLivraisons(livraisons)

        // THEN
        expect(livraisonsEquilibrees).toHaveLength(4)
        expect(livraisonsEquilibrees[0].date).toEqual(livraisons[0].date)
        expect(livraisonsEquilibrees[0].lockers).toEqual(41)
        expect(livraisonsEquilibrees[1].date).toEqual(livraisons[1].date)
        expect(livraisonsEquilibrees[1].lockers).toEqual(41)
        expect(livraisonsEquilibrees[2].date).toEqual(livraisons[2].date)
        expect(livraisonsEquilibrees[2].lockers).toEqual(41)
        expect(livraisonsEquilibrees[3].date).toEqual(livraisons[3].date)
        expect(livraisonsEquilibrees[3].lockers).toEqual(41)
        expect(livraisonsEquilibrees[0].places).toEqual({a: 18, b: 13, c: 10})
        expect(livraisonsEquilibrees[1].places).toEqual({a: 16, b: 14, c: 11})
        expect(livraisonsEquilibrees[2].places).toEqual({a: 17, b: 12, c: 12})
        expect(livraisonsEquilibrees[3].places).toEqual({a: 14, b: 16, c: 11})
    })

    it("cas où on débute avec moins de casiers que la moyenne", function () {
        // GIVEN
        const livraisons: Livraison[] = [{
            date: 20220404,
            lockers: 20,
            places: {a: 5, b: 10, c: 5}
        }, {
            date: 20220411,
            lockers: 45,
            places: {a: 20, b: 15, c: 10}
        }, {
            date: 20220418,
            lockers: 70,
            places: {a: 30, b: 20, c: 20}
        }, {
            date: 20220425,
            lockers: 29,
            places: {a: 10, b: 10, c: 9}
        }]

        // WHEN
        const livraisonsEquilibrees = equilibrageLivraisons(livraisons)

        // THEN
        expect(livraisonsEquilibrees).toHaveLength(4)
        expect(livraisonsEquilibrees[0].date).toEqual(livraisons[0].date)
        expect(livraisonsEquilibrees[1].date).toEqual(livraisons[1].date)
        expect(livraisonsEquilibrees[2].date).toEqual(livraisons[2].date)
        expect(livraisonsEquilibrees[3].date).toEqual(livraisons[3].date)
        expect(livraisonsEquilibrees[0].lockers).toEqual(24)
        expect(livraisonsEquilibrees[1].lockers).toEqual(41)
        expect(livraisonsEquilibrees[2].lockers).toEqual(58)
        expect(livraisonsEquilibrees[3].lockers).toEqual(41)
        expect(livraisonsEquilibrees[0].places).toEqual({a: 7, b: 12, c: 5})
        expect(livraisonsEquilibrees[1].places).toEqual({a: 18, b: 13, c: 10})
        expect(livraisonsEquilibrees[2].places).toEqual({a: 24, b: 17, c: 17})
        expect(livraisonsEquilibrees[3].places).toEqual({a: 16, b: 13, c: 12})
    })

    it("cas où la moyenne n'est pas entière", function () {
        const livraisons: Livraison[] = [{
            date: 20220404,
            lockers: 46,
            places: {a: 20, b: 15, c: 11}
        }, {
            date: 20220411,
            lockers: 29,
            places: {a: 10, b: 10, c: 9}
        }, {
            date: 20220418,
            lockers: 70,
            places: {a: 30, b: 20, c: 20}
        }, {
            date: 20220425,
            lockers: 20,
            places: {a: 5, b: 10, c: 5}
        }]

        // WHEN
        const livraisonsEquilibrees = equilibrageLivraisons(livraisons)

        // THEN
        expect(livraisonsEquilibrees).toHaveLength(4)
        expect(livraisonsEquilibrees[0].date).toEqual(livraisons[0].date)
        expect(livraisonsEquilibrees[1].date).toEqual(livraisons[1].date)
        expect(livraisonsEquilibrees[2].date).toEqual(livraisons[2].date)
        expect(livraisonsEquilibrees[3].date).toEqual(livraisons[3].date)
        expect(livraisonsEquilibrees[0].lockers).toEqual(42)
        expect(livraisonsEquilibrees[1].lockers).toEqual(42)
        expect(livraisonsEquilibrees[2].lockers).toEqual(42)
        expect(livraisonsEquilibrees[3].lockers).toEqual(39)
        expect(livraisonsEquilibrees[0].places).toEqual({a: 18, b: 13, c: 11})
        expect(livraisonsEquilibrees[1].places).toEqual({a: 16, b: 15, c: 11})
        expect(livraisonsEquilibrees[2].places).toEqual({a: 17, b: 12, c: 13})
        expect(livraisonsEquilibrees[3].places).toEqual({a: 14, b: 15, c: 10})
    })

})