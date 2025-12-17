
import { url } from 'inspector';
import cover2 from '../assets/icons/cover2.png';
import { LucideIcon } from 'lucide-react';
import { Link} from 'react-router-dom';
import { RotateCcw, Square, SquareCheckBig,  SquarePen} from 'lucide-react';
import { useState} from "react";


interface GameColors {
    ball: string;
    backround: string;
    leftPaddel: string;
    rightPaddel: string;
    border: string;
}

interface ColorDisplayProps {
    colors: GameColors;
    onColorChange: React.Dispatch<React.SetStateAction<GameColors>>;
}

interface ReadOnlyColorDisplayProps {
    colors: GameColors;
}
function Board({colors}: ReadOnlyColorDisplayProps){
    return (
        <div className="flex flex-col gap-10 h-full w-full items-center p-5 place-content-center">
            <div className="flex justify-between h-[400px] lg:h-[800px] w-full border border-yellow-500 rounded-sm
                bg-no-repeat bg-center bg-cover place-content-center bg-[#1E212A] bg-[url('../src/assets/icons/cover2.png')] shadow-[0_0_20px_rgba(255,_150,_10,_0.8)]"
                style={{ backgroundImage : colors.backround }}>
                <div className=" w-3 h-28 border rounded-full ml-5 m-auto"
                    style={{borderColor:`${colors.border}`, backgroundColor:`${colors.leftPaddel}` }}></div>
                <div className=" w-8 h-8 rounded-full m-auto"
                    style={{backgroundColor:`${colors.ball}` }}></div>
                <div className=" w-3 h-28 border rounded-full mr-5 m-auto"
                    style={{borderColor:`${colors.border}`, backgroundColor:`${colors.rightPaddel}` }}></div>

            </div>
        </div>
    );
}

function Backround({colors, onColorChange}: ColorDisplayProps){
    const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            onColorChange(prevColors => ({ 
                ...prevColors, 
                backround: `url(${newUrl})`,
            }));
        }
    };
   
    return (
        <div className="flex flex-col h-full w-full rounded-sm justify-start ">
            <header className=" relative h-20 lg:h-12 w-full border rounded-t-sm bg-gradient-to-r from-[#e0af0f] via-[#d98209] to-[#dc320c]">
              <h5 className="h-full w-full pl-8 flex justify-between items-center font-electrolize  text-xl text-black ">
                Backround
                <button >
                    <RotateCcw className=" h-10 w-10 text-black hover:text-red-700" />
                </button>
              </h5>
            </header>

            <div className="relative w-full h-full bg-no-repeat bg-center bg-cover border rounded-b-sm bg-[#1E212A]  bg-[url('../src/assets/icons/cover2.png')]"
              style={{backgroundImage: colors.backround }}>
                  <button className="absolute left-1 bottom-1">
                        <label htmlFor="bg-picker">
                            <SquarePen className="h-8 w-8 cursor-pointer text-yellow-500" />
                        </label>

                        <input
                          id="bg-picker"
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageChange}
                          className="hidden"
                        />
                  </button>
            </div>
    </div>
    );
}
function Objects({colors, onColorChange}: ColorDisplayProps){
        const handleBallColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.currentTarget.value;
        onColorChange(prevColors => ({ ...prevColors, ball: newColor }));
};
    
    const handleLeftPaddelColor = (event: React.ChangeEvent<HTMLInputElement>) => {
         const newColor = event.currentTarget.value;
        onColorChange(prevColors => ({ ...prevColors, leftPaddel: newColor }));
    };
    
    const handleRightPaddleColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.currentTarget.value;
        onColorChange(prevColors => ({ ...prevColors, rightPaddel: newColor }));
    };
    
    const handleborderColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.currentTarget.value;
        onColorChange(prevColors => ({ ...prevColors, border: newColor }));
    };
    
    return (
        <div className="flex flex-col h-full w-full items-center justify-start  rounded-sm">
            <header className=" h-20 lg:h-12 w-full bg-gradient-to-r border rounded-t-sm from-[#e0af0f] via-[#d98209] to-[#dc320c]">
              <h5 className="h-full w-full pl-8 flex justify-between items-center font-electrolize  text-xl text-black ">
                Objects
                <button>
                    <RotateCcw className=" h-10 w-10 text-black" />
                </button>
              </h5>
            </header>
        
              <div className="p-2 grid gap-2 grid-cols-3 grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 bg-[#1E212A] 
                    h-full w-full border rounded-b-sm items-center ">
                  <div className="col-span-1  relative border rounded-md border-yellow-400 h-full w-full place-content-center flex flex-col">
                        <div className=" w-12 h-12  border rounded-full m-auto"
                            style={{ backgroundColor:`${colors.ball}` }}
                        ></div>
                        <button  className="absolute left-1 bottom-1">
                            <label htmlFor="ball-color">
                                <SquarePen className="h-8 w-8 text-yellow-400 cursor-pointer" size={20} />
                            </label>
                            <input
                              id="ball-color"
                              type="color"
                              name="foreground"
                              value={colors.ball}
                              onChange={handleBallColor}
                              className="hidden "
                            />
                        </button>
                  </div>
                  <div className="col-span-1 relative border rounded-md border-yellow-400  h-full w-full place-content-center flex flex-col">
                        <div className="w-[10%] h-[50%] max-w-3 max-h-20 border rounded-full  m-auto"
                            style={{ backgroundColor:`${colors.leftPaddel}` }}></div>
                        <button  className="absolute left-1 bottom-1">
                            <label
                              htmlFor="left-paddle-color"
                            >
                                <SquarePen className="h-8 w-8 text-yellow-400 cursor-pointer" size={20} />
                            </label>
                            <input className="hidden"
                            type="color" id="left-paddle-color" name="foreground" value={colors.leftPaddel}
                            onChange={handleLeftPaddelColor}/>
                        </button>
                  </div>
                  <div className="col-span-1 relative border rounded-md border-yellow-400  h-full w-full place-content-center flex flex-col">
                        <div className=" w-[10%] h-[50%] max-w-3 max-h-20 border rounded-full m-auto"
                            style={{ backgroundColor:`${colors.rightPaddel}` }}></div>
                        <button  className="absolute left-1 bottom-1 ">
                            <label
                              htmlFor="rigth-paddle-color"
                            >
                                <SquarePen className="h-8 w-8 text-yellow-400 cursor-pointer" size={20} />
                            </label>
                            <input className="hidden "
                            type="color" id="rigth-paddle-color" name="foreground" value={colors.rightPaddel}
                            onChange={handleRightPaddleColor}/>
                        </button>
                  </div>
                  <div className="col-span-1 relative border rounded-md border-yellow-400  h-full w-full place-content-center flex flex-col">
                        <div className="w-[10%] h-[50%] max-w-3 max-h-20 border rounded-full m-auto"
                            style={{ borderColor:`${colors.border}` }}></div>
                        <button  className="absolute left-1 bottom-1">
                            <label
                              htmlFor="border-color"
                            >
                                <SquarePen className="h-8 w-8 text-yellow-400 cursor-pointer" size={20} />
                            </label>
                            <input className="hidden "
                            type="color" id="border-color" name="foreground" value={colors.border}
                            onChange={handleborderColor}/>
                        </button>
                  </div>
              </div>
        </div>
    );
}
function GameTime(){
    const [Check, setCheck] = useState<LucideIcon>(Square);
    function updateCheck(){
        if (Check === Square)
            setCheck(SquareCheckBig);
        else
            setCheck(Square);
    }
    return (
        <div className="flex flex-col h-full w-full  rounded-sm items-center">
            <header className=" relative h-20 lg:h-12 w-full border rounded-t-sm bg-gradient-to-r from-[#e0af0f] via-[#d98209] to-[#dc320c]">
                <h5 className="h-full w-full pl-8 flex justify-between items-center font-electrolize  text-xl text-black ">
                Game Time
                    <button>
                        <RotateCcw className=" h-10 w-10 text-black" />
                    </button>
                </h5>
            </header>

            <div className="bg-[#1E212A] relative w-full h-full border rounded-b-sm flex flex-col place-content-center p-4">

                <div className='flex gap-2 items-center'>
                    <button onClick={() => updateCheck()} className="">
                        <Check className=" h-10 w-10 text-yellow-500 hover:text-gray-300" />
                    </button>
                    <span className='font-electrolize text-white text-lg'>Display time during the game</span>
                </div>
            </div>
        </div>
            
    );
}
function Scoring(){
    const [Check, setCheck] = useState<LucideIcon>(Square);
    function updateCheck(){
        if (Check === Square)
            setCheck(SquareCheckBig);
        else
            setCheck(Square);
    }
    return (
        <div className="flex flex-col h-full w-full  rounded-sm items-center">
            <header className=" relative h-20 lg:h-12 w-full border rounded-t-sm bg-gradient-to-r from-[#e0af0f] via-[#d98209] to-[#dc320c]">
                <h5 className="h-full w-full pl-8 flex justify-between items-center font-electrolize  text-xl text-black ">
                    Scoring
                    <button>
                        <RotateCcw className=" h-10 w-10 text-black" />
                    </button>
                </h5>
            </header>


            <div className="bg-[#1E212A] relative w-full h-full border rounded-b-sm flex flex-col place-content-center p-4">

                <div className='flex gap-2 items-center'>
                    <button onClick={() => updateCheck()} className="">
                        <Check className=" h-10 w-10 text-yellow-500 hover:text-gray-300" />
                    </button>
                    <span className='font-electrolize text-white text-lg'>Show points of the game</span>
                </div>
            </div>
        </div>
    );
}

export function GameSettings() {
    const [selectedColor, setSelectedColor] = useState<GameColors>({
        ball :"#FFFFFF",
        backround : "../assets/icons/cover2.png",
        leftPaddel : "#008000",
        rightPaddel : "#FF0000",
        border : "#FFFF00"
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-4 h-full w-full gap-2 p-2 items-center overflow-auto">
        <div className="board flex flex-col col-span-1 row-span-3 w-full h-[400px] lg:h-full ">
            <Board colors={selectedColor}/>
        </div>
        <div className="grid grid-cols-1 grid-rows-1 lg:grid-rows-4 col-span-1 row-span-4 justify-between gap-2 w-full h-full">
            <div className="h-[400px] w-full lg:h-full col-span-1 row-span-1 border border-yellow-500 rounded-sm">
                <Backround colors={selectedColor} onColorChange={setSelectedColor}/>
            </div>
            <div className="h-[400px] w-full lg:h-full col-span-1 row-span-1 border border-yellow-500 rounded-sm">
                <Objects colors={selectedColor} onColorChange={setSelectedColor} />
            </div>
            <div className="h-[200px] w-full lg:h-full col-span-1 row-span-1 border border-yellow-500 rounded-sm">
                <GameTime/>
            </div>
            <div className="h-[200px] w-full lg:h-full col-span-1 row-span-1 border border-yellow-500 rounded-sm">
                <Scoring/>
            </div>
        </div>
        <div className='col-span-1 row-span-1 h-14 w-36  lg:h-16 lg:w-48 xl:h-20 xl:w-56 mx-auto ' >
            <button className="flex place-content-center bg-[#FF0000] font-electrolize rounded-sm xl:rounded-lg h-12 w-32 mx-auto">
                <Link
                  className=" h-full w-full text-white hover:text-yellow-400 flex items-center justify-center font-bold"
                  to={"/Gameboard"}>
                  Play Now
                </Link>
            </button>
        
        </div>
    </div>
    );
}