// import fs from 'fs'
// import { Users } from './temp-data/stations_db.user.json' assert {type: 'json'}
// import { log } from 'console';

import { log } from "console"

async function setUsers() {
    // const users = fs.readFileSync(Users)

    // console.log(Users);
    // const collection = await dbService.getCollection('user')

}

// setUsers()
// const variable = []
// console.log("Is Array: ", variable instanceof Array);

async function getTotalGoals(team, year) {
    const numOfGoalsTeam1 = await getNumOfGoalsInTeam(team, year, "team1")
    const numOfGoalsTeam2 = await getNumOfGoalsInTeam(team, year, "team2")
    return numOfGoalsTeam1 + numOfGoalsTeam2
}

async function getNumOfGoalsInTeam(teamName, year, team1or2) {
    let counter = 0
    let response = await fetch(`hacker_rank.com/api/footbal_matches?
        year=${year}&${team1or2}=${teamName}`)
    let result = await response.json()
    const { total_pages } = result
    for (const page of Array.from({ length: total_pages }, (_, i) => i + 1)) {
        response = await fetch(`hacker_rank.com/api/footbal_matches?
            year=${year}&${team1or2}=${teamName}&page=${page}`)
        result = await response.json()
        const { data } = result
        for (const item of data) {
            counter += Number(item[team1or2 + 'goals'])
        }
    }

    return counter
}


const hasSameDigits = function (s) {
    // Input: s = "3902"
    let oldStr = s
    let newStr = ""
    while (oldStr.length > 2) {
        let i = 0
        while (i < oldStr.length - 1) {
            newStr += (Number(oldStr[i]) + Number(oldStr[i + 1])) % 10
            i++
        }
        oldStr = newStr
        newStr = ""
    }
    newStr = oldStr
    
    return newStr[0] === newStr[1]
};
const res = hasSameDigits("3902")
console.log(res);

function getBattery(events) {
    // n = 4
    // events = [10, -20, 61, -15]
    let battery = 50
    for (const event of events) {
        battery += event
        if(battery > 100) battery = 100
        if(battery < 0) battery = 0
    }
    return battery
}

console.log(getBattery([10, -20, 61, -15]));
