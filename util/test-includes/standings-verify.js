const discipline_CUR = "CUR";
const discipline_IHO = "IHO";

var successful = true;

function fieldCompared(fieldname, value, comparedValue) {
	if(value != comparedValue) {		
		console.log("Field " + fieldname +" is NOT correct");
		console.log("The value is:" + value);
		console.log("should be: " + comparedValue);
		successful = false;
	} else {
		console.log(fieldname + " ====================>>  PASS ");
	}
}

function verifyIHOUnitResults(dbStandings, comparedStandings) {
	let event_unit_result = dbStandings.event_unit_results[0];
	let compared_event_unit_result = comparedStandings.event_unit_results[0];
	let successful = fieldCompared("home_country_code", event_unit_result.home_country_code, compared_event_unit_result.home_country_code);
	fieldCompared("home_result", event_unit_result.home_result, compared_event_unit_result.home_result);
	fieldCompared("home_team_name", event_unit_result.event_unit_result, compared_event_unit_result.event_unit_result);
	fieldCompared("home_team_sog_total", event_unit_result.home_team_sog_total, compared_event_unit_result.home_team_sog_total);
	fieldCompared("home_team_penalty_total", event_unit_result.home_team_penalty_total, compared_event_unit_result.home_team_penalty_total);
	fieldCompared("away_country_code", event_unit_result.away_country_code, compared_event_unit_result.away_country_code);
	fieldCompared("away_result", event_unit_result.away_result, compared_event_unit_result.away_result);
	fieldCompared("away_team_name", event_unit_result.away_team_name, compared_event_unit_result.away_team_name);
	fieldCompared("away_team_sog_total", event_unit_result.away_team_sog_total, compared_event_unit_result.away_team_sog_total);
	fieldCompared("away_team_penalty_total", event_unit_result.away_team_penalty_total, compared_event_unit_result.away_team_penalty_total);
	fieldCompared("home_team_code", event_unit_result.home_team_code, compared_event_unit_result.home_team_code);

	for(var i=0; i< event_unit_result.periods.length; i++) {
		let period = event_unit_result.periods[i];
		let comparedPeriod = compared_event_unit_result.periods[i];
		fieldCompared("period.code", period.code, comparedPeriod.code);
		fieldCompared(period.code + ".home_score", period.home_score, comparedPeriod.home_score);
		fieldCompared(period.code + ".home_team_sog", period.home_team_sog, comparedPeriod.home_team_sog);
		fieldCompared(period.code + ".home_team_penalties", period.home_team_penalties, comparedPeriod.home_team_penalties);
		fieldCompared(period.code + ".home_team_penalty_players_bib", JSON.stringify(period.home_team_penalty_players_bib), JSON.stringify(comparedPeriod.home_team_penalty_players_bib));
		fieldCompared(period.code + ".away_score", period.away_score, comparedPeriod.away_score);
		fieldCompared(period.code + ".away_team_sog", period.away_team_sog, comparedPeriod.away_team_sog);
		fieldCompared(period.code + ".away_team_penalties", period.away_team_penalties, comparedPeriod.away_team_penalties);
		fieldCompared(period.code + ".away_team_penalty_players_bib", JSON.stringify(period.away_team_penalty_players_bib), JSON.stringify(comparedPeriod.away_team_penalty_players_bib));
/*			if(period.home_team_penalty_players_bib.length != comparedPeriod.home_team_penalty_players_bib.length) {
			successful = false;
			console.log("Field eriod.home_team_penalty_players_bib is NOT correct");
		} else {				
			for(var j=0; j < period.home_team_penalty_players_bib.length; j++) {
				let players_bib = period.home_team_penalty_players_bib[j];
				let comparedPlayers_bib = comparedPeriod.home_team_penalty_players_bib[j];
				successful = successful || fieldCompared(period.code + ".home_team_penalty_players_bib[" + j + "]", players_bib, comparedPlayers_bib);
			}
		}*/
	}
}

function verifyCURUnitResults(dbStandings, comparedStandings) {
	let event_unit_result = dbStandings.event_unit_results[0];
	let compared_event_unit_result = comparedStandings.event_unit_results[0];
	let successful = fieldCompared("home_country_code", event_unit_result.home_country_code, compared_event_unit_result.home_country_code);
	fieldCompared("home_result", event_unit_result.home_result, compared_event_unit_result.home_result);
	fieldCompared("home_team_name", event_unit_result.home_team_name, compared_event_unit_result.home_team_name);
	fieldCompared("away_country_code", event_unit_result.away_country_code, compared_event_unit_result.away_country_code);
	fieldCompared("away_result", event_unit_result.away_result, compared_event_unit_result.away_result);
	fieldCompared("away_team_name", event_unit_result.away_team_name, compared_event_unit_result.away_team_name);
	fieldCompared("home_team_code", event_unit_result.home_team_code, compared_event_unit_result.home_team_code);

	for(var i=0; i< event_unit_result.periods.length; i++) {
		let period = event_unit_result.periods[i];
		let comparedPeriod = compared_event_unit_result.periods[i];
		fieldCompared("period.code", period.code, comparedPeriod.code);
		fieldCompared(period.code + ".home_score", period.home_score, comparedPeriod.home_score);
		fieldCompared(period.code + ".away_score", period.away_score, comparedPeriod.away_score);
	}
}

function verifyCommonUnitResults(dbStandings, comparedStandings) {
	if(dbStandings.event_unit_results.length != comparedStandings.event_unit_results.length) {
		successful = false;
		console.log("event_unit_results's length is not correct");
	} else {
		for(var i=0; i<dbStandings.event_unit_results.length; i ++) {
			let event_unit_result = dbStandings.event_unit_results[i];
			let compared_event_unit_result = comparedStandings.event_unit_results[i];
			fieldCompared("sort_order", event_unit_result.sort_order, compared_event_unit_result.sort_order);
			fieldCompared("rank", event_unit_result.rank, compared_event_unit_result.rank);
			fieldCompared("country_code", event_unit_result.country_code, compared_event_unit_result.country_code);
			fieldCompared("result", event_unit_result.result, compared_event_unit_result.result);
			fieldCompared("diff", event_unit_result.diff, compared_event_unit_result.diff);
			fieldCompared("is_team", event_unit_result.is_team, compared_event_unit_result.is_team);
			fieldCompared("team_name", event_unit_result.team_name, compared_event_unit_result.team_name);
			fieldCompared("team_code", event_unit_result.team_code, compared_event_unit_result.team_code);
			fieldCompared("athletes_total", event_unit_result.athletes_total, compared_event_unit_result.athletes_total);

			if(event_unit_result.athletes.length != compared_event_unit_result.athletes.length) {
				successful = false;
				console.log("event_unit_results["+ i +"].athletes's length is not connect");
			} else {
				for(var j =0; j < event_unit_result.athletes.length; j ++) {					
					let athlete = event_unit_result.athletes[j];
					let comparedAthlete = compared_event_unit_result.athletes[j];
					fieldCompared("athlete.athlete_code", athlete.athlete_code, comparedAthlete.athlete_code);
					fieldCompared(athlete.athlete_code + ".athlete_name", athlete.athlete_name, comparedAthlete.athlete_name);
					fieldCompared(athlete.athlete_code + ".athlete_lastname", athlete.athlete_lastname, comparedAthlete.athlete_lastname);
					fieldCompared(athlete.athlete_code + ".athlete_country_code", athlete.athlete_country_code, comparedAthlete.athlete_country_code);
					fieldCompared(athlete.athlete_code + ".athlete_gender", athlete.athlete_gender, comparedAthlete.athlete_gender);
					fieldCompared(athlete.athlete_code + ".athlete_bib", athlete.athlete_bib, comparedAthlete.athlete_bib);
					fieldCompared(athlete.athlete_code + ".athlete_dob", athlete.athlete_dob, comparedAthlete.athlete_dob);
				}
			}
		}
	}	
}

function verify(dbStandings, comparedStandings) {
	console.log("start to verify fields...");

	fieldCompared("event_unit_code_full", dbStandings.event_unit_code_full, comparedStandings.event_unit_code_full);
	fieldCompared("discipline_code", dbStandings.discipline_code, comparedStandings.discipline_code);
	fieldCompared("discipline_name", dbStandings.discipline_name, comparedStandings.discipline_name);
	fieldCompared("curr_date", (new Date(dbStandings.curr_date)).getTime(), (new Date(comparedStandings.curr_date)).getTime());
	fieldCompared("curr_date_logical", (new Date(dbStandings.curr_date_logical)).getTime(), (new Date(comparedStandings.curr_date_logical)).getTime());
	fieldCompared("event_code", dbStandings.event_code, comparedStandings.event_code);
	fieldCompared("event_name", dbStandings.event_name, comparedStandings.event_name);
	fieldCompared("event_gender", dbStandings.event_gender, comparedStandings.event_gender);
	fieldCompared("event_unit_code", dbStandings.event_unit_code, comparedStandings.event_unit_code);
	fieldCompared("event_unit_name", dbStandings.event_unit_name, comparedStandings.event_unit_name);
	fieldCompared("event_unit_start_date",  (new Date(dbStandings.event_unit_start_date)).getTime(), (new Date(comparedStandings.event_unit_start_date)).getTime());
	fieldCompared("event_unit_venue_name", dbStandings.event_unit_venue_name, comparedStandings.event_unit_venue_name);
	fieldCompared("event_unit_location_name", dbStandings.event_unit_location_name, comparedStandings.event_unit_location_name);
	fieldCompared("event_unit_result_status", dbStandings.event_unit_result_status, comparedStandings.event_unit_result_status);
	fieldCompared("event_unit_result_type", dbStandings.event_unit_result_type, comparedStandings.event_unit_result_type);
	
	if(dbStandings.discipline_code == discipline_CUR) {
		verifyCURUnitResults(dbStandings, comparedStandings);
	} else if( dbStandings.discipline_code == discipline_IHO) {
		verifyIHOUnitResults(dbStandings, comparedStandings);
	} else {
		verifyCommonUnitResults(dbStandings, comparedStandings);
	}
	return successful;
}

exports.verify = verify;