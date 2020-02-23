const _ = require('lodash');
const xml2js = require('xml2js');
const Q = require('q');
const fs = require('fs');

const discipline_CUR = "CUR";
const discipline_IHO = "IHO";
function parserIHOStatsItem(resultsOriginal, code, pos, team_code) {
	if(resultsOriginal && !isNaN(resultsOriginal.length)) {
		for (var i = 0; i < resultsOriginal.length; i++) {
			let odfBody_Competition_Result = resultsOriginal[i];
			if(odfBody_Competition_Result.Competitor.Code == team_code) {
				let statsItemsOriginal = odfBody_Competition_Result.Competitor.StatsItems.StatsItem;
				if(statsItemsOriginal) {
					if(!isNaN(statsItemsOriginal.length)) {
						for(var j = 0; j < statsItemsOriginal.length; j++) {
							let statsItem = statsItemsOriginal[j];
							if(statsItem.Code == code && statsItem.Pos == pos) {
								return statsItem.Value;
							}
						}
					} else {
						if (statsItemsOriginal.Code == code && statsItemsOriginal.Pos == pos) {
							return statsItemsOriginal.Value;
						}
					}
				}				
			}
		}							
	}
}

function parserIHOPlayersBib(resultsOriginal, code, pos, team_code) {
	let bib_array = [];
	if(resultsOriginal && !isNaN(resultsOriginal.length)) {
		for (let i = 0; i < resultsOriginal.length; i++) {
			let odfBody_Competition_Result = resultsOriginal[i];
			if(odfBody_Competition_Result.Competitor.Code == team_code) {
				let	athletesOriginal = odfBody_Competition_Result.Competitor.Composition.Athlete;
				if(athletesOriginal && !isNaN(athletesOriginal.length)) {
					for (let j = 0; j < athletesOriginal.length; j ++) {						
						let per_Athlete = athletesOriginal[j];
						if(!per_Athlete.StatsItems) {
							continue;
						} 
						let statItemsOriginal = per_Athlete.StatsItems.StatsItem;
						if(statItemsOriginal) {
							if (!isNaN(statItemsOriginal.length)) {
								for(var k = 0; k < statItemsOriginal.length; k ++) {
									let per_statItem = statItemsOriginal[k];
									if(per_statItem.Code == code && per_statItem.Pos == pos && per_statItem.Value >= 1) {
										bib_array.push(per_Athlete.Bib);
									}
								}
							} else {
								if(statItemsOriginal.Code == code && statItemsOriginal.Pos == pos && statItemsOriginal.Value >= 1) {
										bib_array.push(per_Athlete.Bib);
								}
							}
						} 
					}
				}
				break;
			}			
		}
	}	
	return bib_array;
}

function parserIHOPeriod(odfBody_Competition, per_odfBody_Competition_Periods_Period, home_team_code, away_team_code) {
	let resultsOriginal = odfBody_Competition.Result;
	let code = per_odfBody_Competition_Periods_Period.Code;
	let home_score = per_odfBody_Competition_Periods_Period.HomePeriodScore;
	let home_team_sog = parserIHOStatsItem(resultsOriginal, "SOG", code, home_team_code);
	let home_team_penalties = parserIHOStatsItem(resultsOriginal, "PTY", code, home_team_code);
	let home_team_penalty_players_bib = parserIHOPlayersBib(resultsOriginal, "PTY", code, home_team_code);
	let away_score = per_odfBody_Competition_Periods_Period.AwayPeriodScore;
	let away_team_sog = parserIHOStatsItem(resultsOriginal, "SOG", code, away_team_code);
	let away_team_penalties = parserIHOStatsItem(resultsOriginal, "PTY", code, away_team_code);
	let away_team_penalty_players_bib = parserIHOPlayersBib(resultsOriginal, "PTY", code, away_team_code);
	const period = {
		code: `${code}`,
		home_score: `${home_score}`,
		home_team_sog: `${home_team_sog}`,
		//home_team_sog_players_bib: `${home_team_sog_players_bib}`,
		home_team_penalties: `${home_team_penalties}`,
		home_team_penalty_players_bib: home_team_penalty_players_bib, 
		away_score: `${away_score}`,
		away_team_sog: `${away_team_sog}`,
		//away_team_sog_players_bib: `${away_team_sog_players_bib}`,
		away_team_penalties: `${away_team_penalties}`,
		away_team_penalty_players_bib: away_team_penalty_players_bib,
	}
	return period;
}

function parserIHOUnitResults(odfBody_Competition) {
	let event_unit_results = [];
	let current_period = parserExtendedInfoValue(odfBody_Competition.ExtendedInfos.ExtendedInfo, 'PERIOD');

	let home_team_code = odfBody_Competition.Periods.Home;
	let home_country_code = "";
	let home_result = "";
	let home_team_name = "";	
	let home_team_penalty_total = "";
	let home_team_sog_total = "";	

	let away_team_code = odfBody_Competition.Periods.Away;
	let away_country_code = "";
	let away_result = "";
	let away_team_name = "";
	let away_team_penalty_total = "";
	let away_team_sog_total = "";

	let odfBody_Competition_Results = odfBody_Competition.Result;
	if(odfBody_Competition_Results && odfBody_Competition_Results.length > 0) {
		_.each(odfBody_Competition_Results, (per_result) => {
			if(per_result.Competitor.Code == home_team_code) {
				//It is the reuslt of home team
				home_country_code = per_result.Competitor.Organisation;
				home_result = per_result.Result;
				home_team_name = isNaN(per_result.Competitor.Description)? '': per_result.Competitor.Description.TeamName;
				home_team_penalty_total = parserIHOStatsItem(odfBody_Competition_Results, "PTY","TOT", home_team_code);
				home_team_sog_total = parserIHOStatsItem(odfBody_Competition_Results, "SOG","TOT",home_team_code);
			} else {
				//It is the reuslt of away team
				away_country_code = per_result.Competitor.Organisation;
				away_result = per_result.Result;
				away_team_name = isNaN(per_result.Competitor.Description)? '': per_result.Competitor.Description.TeamName;
				away_team_penalty_total = parserIHOStatsItem(odfBody_Competition_Results, "PTY","TOT", away_team_code);
				away_team_sog_total = parserIHOStatsItem(odfBody_Competition_Results, "SOG","TOT",away_team_code);
			}
		});
	}
	let periods = [];
	let periodsOriginal = odfBody_Competition.Periods.Period;
	if(periodsOriginal) {
		if(isNaN(periodsOriginal.length)) {
			periods.push(parserIHOPeriod(odfBody_Competition, periodsOriginal, home_team_code, away_team_code));
		} else {
			_.each(periodsOriginal, (per_period) =>{
				periods.push(parserIHOPeriod(odfBody_Competition, per_period, home_team_code, away_team_code));
			});
		}
	}
	const per_unit_result = {
		current_period: `${current_period}`,
		home_country_code: `${home_country_code}`,
		home_result: `${home_result}`,
		home_team_name: `${home_team_name}`,
		home_team_code: `${home_team_code}`,
		home_team_penalty_total: `${home_team_penalty_total}`,
		home_team_sog_total: `${home_team_sog_total}`,
		away_country_code: `${away_country_code}`,
		away_result: `${away_result}`,
		away_team_name: `${away_team_name}`,
		away_team_code: `${away_team_code}`,
		away_team_penalty_total: `${away_team_penalty_total}`,
		away_team_sog_total: `${away_team_sog_total}`,
		periods: periods,
	}
	event_unit_results.push(per_unit_result);
	return event_unit_results;
}


function parserCURPeriod(odfBody_Competition_Periods_period) {
	let code = odfBody_Competition_Periods_period.Code;
	let home_score = odfBody_Competition_Periods_period.HomePeriodScore;
	let away_score = odfBody_Competition_Periods_period.AwayPeriodScore;
	const period = {
		code: `${code}`,
		home_score: `${home_score}`,
		away_score: `${away_score}`,
	}
	return period;
}

function parserCURUnitResults(odfBody_Competition) {
	let event_unit_results = [];
	let current_period = parserExtendedInfoValue(odfBody_Competition.ExtendedInfos.ExtendedInfo, 'PERIOD');
	let home_team_code = odfBody_Competition.Periods.Home;
	let away_team_code = odfBody_Competition.Periods.Away;
	let odfBody_Competition_results = odfBody_Competition.Result;
	let home_country_code = "";
	let home_result = "";
	let home_team_name = "";
	let away_country_code = "";
	let away_result = "";
	let away_team_name = "";
	if(odfBody_Competition_results && odfBody_Competition_results.length > 0) {
		_.each(odfBody_Competition_results, (per_result) => {
			if(per_result.Competitor.Code == home_team_code) {
				//It is the reuslt of home team
				home_country_code = per_result.Competitor.Organisation;
				home_result = per_result.Result;
				home_team_name = per_result.Competitor.Description.TeamName;
			} else {
				//It is the reuslt of away team
				away_country_code = per_result.Competitor.Organisation;
				away_result = per_result.Result;
				away_team_name = per_result.Competitor.Description.TeamName;
			}
		});
	}
	let periods = [];
	let periodsOriginal = odfBody_Competition.Periods.Period;
	if(periodsOriginal) {
		if(isNaN(periodsOriginal.length)) {
			periods.push(parserCURPeriod(periodsOriginal));
		} else {
			_.each(periodsOriginal, (per_period) =>{
				periods.push(parserCURPeriod(per_period));
			});
		}
	}
	const per_unit_result = {
		current_period: `${current_period}`,
		home_country_code: `${home_country_code}`,
		home_result: `${home_result}`,
		home_team_name: `${home_team_name}`,
		home_team_code: `${home_team_code}`,
		away_country_code: `${away_country_code}`,
		away_result: `${away_result}`,
		away_team_name: `${away_team_name}`,
		away_team_code: `${away_team_code}`,
		periods: periods,
	}
	event_unit_results.push(per_unit_result);
	return event_unit_results;
}


function parserExtendedInfoValue(extendedInfolist, code) {
	if(extendedInfolist) {
		if(isNaN(extendedInfolist.length)) {
			if(extendedInfolist.Code == code) {
				return extendedInfolist.Value;
			}
		} else {
			for(var i = 0; i < extendedInfolist.length; i++) {
				let eachExtendedInfo = extendedInfolist[i];
				if(eachExtendedInfo.Code == code) {
					return eachExtendedInfo.Value;
				}
			}
		}
	}
}

function parserCommonUnitAlthete(odfBody_Competition_Result_Competitor_Composition_Athlete) {
    let athlete_code = odfBody_Competition_Result_Competitor_Composition_Athlete.Code;
    let athlete_name = odfBody_Competition_Result_Competitor_Composition_Athlete.Description.GivenName;
    let athlete_lastname = odfBody_Competition_Result_Competitor_Composition_Athlete.Description.FamilyName;
    let athlete_country_code = odfBody_Competition_Result_Competitor_Composition_Athlete.Description.Organisation;
    let athlete_gender = odfBody_Competition_Result_Competitor_Composition_Athlete.Description.Gender;
    let athlete_bib = odfBody_Competition_Result_Competitor_Composition_Athlete.Bib;
    let athlete_dob = odfBody_Competition_Result_Competitor_Composition_Athlete.Description.BirthDate;
    const per_event_unit_result_athlete = {
		athlete_code: `${athlete_code}`,
		athlete_name: `${athlete_name}`,
		athlete_lastname: `${athlete_lastname}`,
		athlete_country_code: `${athlete_country_code}`,
		athlete_gender: `${athlete_gender}`,
		athlete_bib: `${athlete_bib}`,
		athlete_dob: `${athlete_dob}`,
	};
	return per_event_unit_result_athlete;    		 		
}

function parserCommonUnitResult(odfBody_Competition_Result) {
	let sort_order = odfBody_Competition_Result.SortOrder;
    let rank = odfBody_Competition_Result.Rank;
    //let medal =
    let country_code = odfBody_Competition_Result.Competitor.Organisation;
    let result = odfBody_Competition_Result.Result;
    let diff = odfBody_Competition_Result.Diff;
    let is_team = odfBody_Competition_Result.Competitor.Type == 'T'? true: false;
    let team_name = '';
    let team_code = '';
    if(is_team) {     		 			
     	team_name = odfBody_Competition_Result.Competitor.Description.TeamName;
     	team_code = odfBody_Competition_Result.Competitor.Code;
    }
    let athletes_total = 0;
    let athletesOriginal = odfBody_Competition_Result.Competitor.Composition.Athlete;
    let event_unit_result_athletes = [];
    if(athletesOriginal) {
    	if (isNaN(athletesOriginal.length)) {
    		// It is an object
    		athletes_total = 1;
			event_unit_result_athletes.push(parserCommonUnitAlthete(athletesOriginal));
    	} else {
    		//It is an array
    		athletes_total =  athletesOriginal.length ;
     		_.each(athletesOriginal, (perAthlete) => {
				event_unit_result_athletes.push(parserCommonUnitAlthete(athletesOriginal));
     		});
    	}
    } 
    const per_event_unit_result = {
		sort_order: isNaN(sort_order)?'':`${sort_order}`,
		rank: isNaN(rank)? '':`${rank}`,
		country_code: country_code == undefined? '':`${country_code}`,
		result: isNaN(result)? '':`${result}`,
		diff: isNaN(diff)? '':`${diff}`,
		is_team: is_team,
		team_name: is_team? `${team_name}`:'',
		team_code: is_team? `${team_code}`:'',
		athletes_total: `${athletes_total}`, // It is a string
		athletes: event_unit_result_athletes,
  	};
  	return per_event_unit_result;
}

function parserCommonUnitResults(resultsOriginal) {
	let event_unit_results = [];
	if (resultsOriginal) {
	    if(isNaN(resultsOriginal.length)) {
	      	//It is an object
	      	event_unit_results.push(parserCommonUnitResult(resultsOriginal));
	    } else {
	      	//It is an array
	      	_.each(resultsOriginal, (odfBody_Competition_Result) => {
	      		event_unit_results.push(parserCommonUnitResult(odfBody_Competition_Result));
	    	});
	    }
	}
	return event_unit_results;
}

function parserDTResult(xmlFileName) {

	var deferred = Q.defer();

	const parser = new xml2js.Parser({
	    explicitArray: false,
	    ignoreAttrs: false,
	    mergeAttrs: true,
	    normalizeTags: false,
	});
	const body = fs.readFileSync(xmlFileName, 'utf8');
	parser.parseString(body, (err, result) => {
	    if (err) {
	      	console.log('Parser xml file failed: Error in Parser.parseString', err);
	      	deferred.reject(err);
	    } else {
	      	// Turn the output into real json object and set up some vars
//	      	const rawData = JSON.stringify(result, null, 2);
//	      	const gameData = JSON.parse(rawData);

	      	let odfBody = result.OdfBody;
	      	var discipline_code = odfBody.DocumentCode.substr(0, 3).replace(/-/g, '');
	      	//TODO should consider if the field is not present.
	      	try {var discipline_name = odfBody.Competition.ExtendedInfos.SportDescription.DisciplineName; } catch(error) {console.log("odfBody.Competition.ExtendedInfos.SportDescription.DisciplineName is not present"); discipline_name = '';}
	      	let curr_date = odfBody.Date + "T" + odfBody.Time.substr(0, 2) + ":" + odfBody.Time.substr(2, 2) + ":" + odfBody.Time.substr(4, 2) + "." + odfBody.Time.substr(6, 3) + "+09:00";
	      	let curr_date_logical = odfBody.LogicalDate + "T" + odfBody.Time.substr(0, 2) + ":" + odfBody.Time.substr(2, 2) + ":" + odfBody.Time.substr(4, 2) + "." + odfBody.Time.substr(6, 3) + "+09:00";
	      	let event_code = odfBody.DocumentCode.substr(3, 19).replace(/-/g, '');
	      	let event_name = odfBody.Competition.ExtendedInfos.SportDescription.EventName;
	      	let event_gender = odfBody.Competition.ExtendedInfos.SportDescription.Gender;
  			let event_unit_code = odfBody.DocumentCode.substr(22, 12).replace(/-/g, '');
	      	let event_unit_code_full = odfBody.DocumentCode;
	      	let event_unit_name = odfBody.Competition.ExtendedInfos.SportDescription.SubEventName;
	      	let event_unit_start_date = odfBody.Competition.ExtendedInfos.UnitDateTime.StartDate;
	      	//let event_unit_end_date = odfBody.Competition.ExtendedInfos.UnitDateTime.EndDate; //TODO
	      	let event_unit_venue_name = odfBody.Competition.ExtendedInfos.VenueDescription.VenueName;
	      	let event_unit_location_name = odfBody.Competition.ExtendedInfos.VenueDescription.LocationName;
	      	let event_unit_result_status = odfBody.ResultStatus;

	      	let event_unit_result_type = '';

	      	let resultsOriginal = odfBody.Competition.Result;
	      	if (resultsOriginal) {
	      		if(isNaN(resultsOriginal.length)) {
	      			//It is an object
	      			event_unit_result_type = resultsOriginal.ResultType;
	      		} else {
	      			//It is an array
	      			event_unit_result_type = resultsOriginal[0].ResultType;
	      		}
	      	}

	      	let event_unit_results = [];
	      	if(discipline_code == discipline_CUR) {
	      		event_unit_results = parserCURUnitResults(odfBody.Competition);
	      	} else if(discipline_code == discipline_IHO) {
				event_unit_results = parserIHOUnitResults(odfBody.Competition);
	      	} else {
	      		event_unit_results = parserCommonUnitResults(odfBody.Competition.Result);
	      	}
	      	const standing_result = {
			    discipline_code: `${discipline_code}`,
			    discipline_name: `${discipline_name}`,
			    curr_date: `${curr_date}`,
			    curr_date_logical: `${curr_date_logical}`,
			    event_code: `${event_code}`,
			    event_name: `${event_name}`,
			    event_gender: `${event_gender}`,
			    event_unit_code: `${event_unit_code}`,
			    event_unit_code_full: `${event_unit_code_full}`,
			    event_unit_name: `${event_unit_name}`,
			    event_unit_start_date: `${event_unit_start_date}`,
			    event_unit_venue_name: `${event_unit_venue_name}`,
			    event_unit_location_name: `${event_unit_location_name}`,
			    event_unit_result_status: `${event_unit_result_status}`,
			    event_unit_result_type: `${event_unit_result_type}`,
			    event_unit_results: event_unit_results,
			    // created_on: `${created_on}`,
			    // updated_on: `${updated_on}`,
  			};

 
	      	deferred.resolve(standing_result);
	  	}
	});
  	return deferred.promise;
}
exports.parserDTResult = parserDTResult;