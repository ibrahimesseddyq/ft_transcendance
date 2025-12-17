import { Achivements } from "@/components/Achivements";
import {Medal , Award , Trophy  , BrainCircuit, Crown  , Volleyball, CalendarDays as Calendar1 } from "lucide-react";

  //player Data
  export const Matches = [
    { date: "4/3/22", opponent: "Player A", result: "WIN" },
    { date: "4/3/22", opponent: "Player B", result: "LOSS" },
    { date: "4/3/22", opponent: "Player C", result: "DRAW" },
    { date: "4/3/22", opponent: "Player A", result: "WIN" },
    { date: "4/3/22", opponent: "Player B", result: "LOSS" },
    { date: "4/3/22", opponent: "Player C", result: "DRAW" },
    { date: "4/3/22", opponent: "Player A", result: "WIN" },
    { date: "4/3/22", opponent: "Player B", result: "LOSS" },
    { date: "4/3/22", opponent: "Player C", result: "DRAW" },
    { date: "4/3/22", opponent: "Player A", result: "WIN" },
  ];
  
  export const Achive = [
      { name: "Medal ", icon: Medal , current: false },
      { name: "Crown", icon: Crown, current: false },
      { name: "Award ", icon: Award , current: false },
      { name: "Trophy ", icon: Trophy  , current: false },
      { name: "Tournaments", icon: Trophy, current: false },
      { name: "Calendar1", icon: Calendar1, current: false },
      { name: "Volleyball", icon: Volleyball, current: false },
      { name: "BrainCircuit", icon: BrainCircuit, current: false },
  
  ];

const User = {
  name : "#",
  login : "#",
  email : "#",
  status : "#",
  imagePath: "../src/assets/icons/profile.png",
  matches : Matches,
  Achivements : Achive,
  totalGames : 0,
  rank : 0,
  win: 0,
  lose: 0,
  draw: 0,
}

  //global Data
  export const AllMatches = [
      {user: User, date: "4/3/22", time: "8:40", condition: "VICTORY", name: "ael-fagr", gametype: "LOCAL"},
      {user: User, date: "4/3/22", time: "8:40", condition: "DEFEAT", name: "ael-fagr", gametype: "REMOTE"},
      {user: User, date: "4/3/22", time: "8:40", condition: "DRAW", name: "ael-fagr", gametype: "LOCAL"},
      {user: User, date: "4/3/22", time: "8:40", condition: "DEFEAT", name: "ael-fagr", gametype: "REMOTE"},
      {user: User, date: "4/3/22", time: "8:40", condition: "VICTORY", name: "ael-fagr", gametype: "LOCAL"},
      {user: User, date: "4/3/22", time: "8:40", condition: "VICTORY", name: "ael-fagr", gametype: "REMOTE"},
      {user: User, date: "4/3/22", time: "8:40", condition: "DRAW", name: "ael-fagr", gametype: "LOCAL"},
    ];
  
  export const AllUsers = [
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: Matches, Achiv: Achive, totalgames: 10, rank: 1, win: 14, lose: 7 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: Matches, Achiv: Achive, totalgames: 10, rank: 2, win: 14, lose: 5 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: Matches, Achiv: Achive, totalgames: 10, rank: 3, win: 14, lose: 4 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: Matches, Achiv: Achive, totalgames: 10, rank: 4, win: 14, lose: 3 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: Matches, Achiv: Achive, totalgames: 10, rank: 5, win: 14, lose: 1 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: Matches, Achiv: Achive, totalgames: 10, rank: 6, win: 14, lose: 1 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: Matches, Achiv: Achive, totalgames: 10, rank: 7, win: 14, lose: 0 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: Matches, Achiv: Achive, totalgames: 10, rank: 8, win: 14, lose: 0 , draw: 3},
    { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: Matches, Achiv: Achive, totalgames: 10, rank: 9, win: 14, lose: 0 , draw: 3},
  ];

const game = {
    users : AllUsers,
    matches :  AllMatches,
};
