'use strict';

const RandomTeams = require('../../data/random-teams');

const fs = require('fs');

function extend(obj, src) {
	for (let key in src) {
		if (src.hasOwnProperty(key)) obj[key] = src[key];
	}
	return obj;
}

let DSSB = JSON.parse(fs.readFileSync('config/ssb.json', 'utf-8'));

class RandomCustomSSBTeams extends RandomTeams {
	randomCustomSSBTeam() {
		//let DSSB = JSON.parse(fs.readFileSync('config/ssb.json', 'utf-8'));
		let team = [];
		let variant = this.random(2);

		//Parse player objects into sets.
		let ssbSets = {};
		for (let key in DSSB) {
			if (!DSSB[key].active) continue; //This pokemon is not to be used yet.
			ssbSets[(DSSB[key].symbol + DSSB[key].name)] = {};
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].name = DSSB[key].name;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].species = DSSB[key].species;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].ability = DSSB[key].ability;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].item = DSSB[key].item;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].gender = (DSSB[key].gender === 'random' ? ((variant === 1) ? 'M' : 'F') : DSSB[key].gender);
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].moves = DSSB[key].movepool;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].signatureMove = DSSB[key].cMove;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].evs = DSSB[key].evs;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].ivs = DSSB[key].ivs;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].nature = DSSB[key].nature;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].level = parseInt(DSSB[key].level);
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].shiny = DSSB[key].shiny;
			ssbSets[(DSSB[key].symbol + DSSB[key].name)].happiness = DSSB[key].happiness;
		}

		//var sets = extend(baseSets, ssbSets);
		let backupSet = {
			'Unown': {
				species: 'Unown',
				ability: 'Levitate',
				item: 'Choice Specs',
				moves: ['Hidden Power'],
				evs: {
					spa: 252,
					spd: 252,
					hp: 4,
				},
				nature: 'Modest',
			},
		};
		let sets;
		if (Object.keys(ssbSets).length === 0) {
			sets = extend(ssbSets, backupSet);
		} else {
			sets = ssbSets;
		}

		for (let k in sets) {
			sets[k].moves = sets[k].moves.map(toId);
			if (sets[k].baseSignatureMove) sets[k].baseSignatureMove = toId(sets[k].baseSignatureMove);
		}

		// Generate the team randomly.
		let pool = Object.keys(sets);
		for (let i = 0; i < (Object.keys(sets).length < 6 ? Object.keys(sets).length : 6); i++) {
			let name = this.sampleNoReplace(pool);
			/*if (i === 1 && DSSB[toId(side.name)] && DSSB[toId(side.name)].active && sets[(DSSB[toId(side.name)].symbol + DSSB[toId(side.name)].name)] && pool.indexOf((DSSB[toId(side.name)].symbol + DSSB[toId(side.name)].name)) !== -1) {
				pool.push(name); //re-add
				name = pool[pool.indexOf((DSSB[toId(side.name)].symbol + DSSB[toId(side.name)].name))];
				pool.splice(pool.indexOf(name), 1);
			}*/
			let set = sets[name];
			set.name = name;
			if (!set.level) set.level = 100;
			if (!set.ivs) {
				set.ivs = {
					hp: 31,
					atk: 31,
					def: 31,
					spa: 31,
					spd: 31,
					spe: 31,
				};
			} else {
				for (let iv in {
					hp: 31,
					atk: 31,
					def: 31,
					spa: 31,
					spd: 31,
					spe: 31,
				}) {
					set.ivs[iv] = iv in set.ivs ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) {
				set.evs = {
					hp: 84,
					atk: 84,
					def: 84,
					spa: 84,
					spd: 84,
					spe: 84,
				};
			}
			if (set.signatureMove) {
				set.moves = [this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves)].concat(set.signatureMove);
			}
			team.push(set);
		}
		return team;
	}
}

module.exports = RandomCustomSSBTeams;