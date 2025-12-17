import { Pause  } from 'lucide-react';
const fetchPromise = fetch(
  "https://api.intra.42.fr/v2/users/avisenti",
);

console.log(fetchPromise);

fetchPromise.then((response) => {
  console.log(`Received response: ${response}`);
});
fetchPromise.catch((err) => {
  console.log('error is ' + err);
});

console.log("Started request…");

function Board(props){
    return (
        <div className="flex justify-between h-[400px] lg:h-[600px] xl:h-[800px]  w-full max-w-[1500px] border border-yellow-500 rounded-sm
            bg-no-repeat bg-center bg-cover place-content-center bg-[#1E212A] bg-[url('../src/assets/icons/cover2.png')] shadow-[0_0_20px_rgba(255,_150,_10,_0.8)]"
            style={{ backgroundImage : props.backround }}>
            <div className="w-2 h-16 lg:w-3 lg:h-24 xl:w-3 xl:h-28 border rounded-full  m-auto"
                style={{borderColor:`${props.border}`, backgroundColor:`${props.leftPaddel}` }}></div>
            <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 border rounded-full m-auto"
                style={{backgroundColor:`${props.ball}` }}></div>
            <div className="w-2 h-16 lg:w-3 lg:h-24 xl:w-3 xl:h-28 border rounded-full m-auto"
                style={{borderColor:`${props.border}`, backgroundColor:`${props.rightPaddel}` }}></div>
        </div>
    );
}
export function GameBoard(props) {
    return (
        <div className="lg:w-[80%] h-full flex flex-col gap-4 justify-center items-center mx-auto">
            <div className="timer w-[10%] h-10  rounded-lg bg-yellow-400 mx-auto place-items-center place-content-center">
                <h1 className='text-white'>1:44</h1>
            </div>
            <div className=" w-full max-w-[1500px] h-20 flex justify-between items-center">
                <div className="h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24  rounded-full bg-cover bg-center border border-yellow-400"
                style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}></div>

                <div className="score bg-gradient-to-tr from-[#000000] to-[#840404]
                    rounded-full h-[50%] w-[20%] flex justify-between items-center p-5">
                    <h1 className='text-yellow-500'>05</h1>
                    <Pause  className=" text-yellow-500" />
                    <h1 className='text-yellow-500'>05</h1>
                </div>

                <div className="h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 rounded-full bg-cover bg-center border border-yellow-400"
                style={{ backgroundImage: "url('../src/assets/icons/profile.png')" }}></div>
            </div>
                <Board props/>
        </div>
    );
}