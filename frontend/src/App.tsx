import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home, Gamepad2, MessageCircleMore ,Settings, LogOut, Medal , Award , Trophy  , BrainCircuit, Crown  , Volleyball, Calendar1 } from "lucide-react";
import {Main} from '@/pages/main'

export const navigation = [
  { name: "Home", path: "/homepage", icon: Home }, 
  { name: "Games", path: "/games", icon: Gamepad2}, 
  { name: "Chat", path: "/chat", icon: MessageCircleMore }, 
  { name: "Tournaments", path: "/tournaments", icon: Trophy}, 
  { name: "Settings", path: "/settting", icon: Settings},
  { name: "LogOut", path: "/logout", icon: LogOut},
];
export const matches = [
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
    { name: "Medal ", icon: Medal , current: true },
    { name: "Crown", icon: Crown, current: true },
    { name: "Award ", icon: Award , current: true },
    { name: "Trophy ", icon: Trophy  , current: true },
    { name: "Tournaments", icon: Trophy, current: false },
    { name: "Calendar1", icon: Calendar1, current: false },
    { name: "Volleyball", icon: Volleyball, current: false },
    { name: "BrainCircuit", icon: BrainCircuit, current: false },

];

export const Users = [
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: matches, Achiv: Achive, totalgames: 10, rank: 1, win: 14, lose: 7 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: matches, Achiv: Achive, totalgames: 10, rank: 2, win: 14, lose: 6 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: matches, Achiv: Achive, totalgames: 10, rank: 3, win: 14, lose: 6 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "online", matches: matches, Achiv: Achive, totalgames: 10, rank: 4, win: 14, lose: 4 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: matches, Achiv: Achive, totalgames: 10, rank: 5, win: 14, lose: 3 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: matches, Achiv: Achive, totalgames: 10, rank: 6, win: 14, lose: 7 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: matches, Achiv: Achive, totalgames: 10, rank: 7, win: 14, lose: 7 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: matches, Achiv: Achive, totalgames: 10, rank: 8, win: 14, lose: 7 , draw: 3},
  { name: "CHIDORI", login: "ael-fagr", email: "elfagrouch9@gmail.com", status: "offline",matches: matches, Achiv: Achive, totalgames: 10, rank: 9, win: 14, lose: 7 , draw: 3},
];



const queryClient = new QueryClient();

const App = () => (
  
    
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;