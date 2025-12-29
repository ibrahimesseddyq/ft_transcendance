const JobsArray = [
  {
    id: 1,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 2,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 3,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 4,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 5,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 6,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 7,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 8,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 9,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  },
  {
    id: 10,
    category: "Enginering",
    title: "Front-End UX Engineer",
    description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
    type: "Full-time",
    location: "Remote",
    salary: "10 000-15 000"
  }
];

export function Jobs() {
   
  return (
    <div className="flex flex-col  h-full w-full gap-5 overflow-auto m-auto">
       <div className="Title font-extrabold text-white pl-36 pt-14">Jobs For You:</div>
       <div className="flex flex-col items-center gap-5 overflow-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-green-500
          [&::-webkit-scrollbar-thumb]:rounded-full">
          {JobsArray.map((item) => {
            return (
              <div
                className="flex flex-col w-[600px] h-[150px] rounded-md pl-10 pt-4 gap-3 bg-[#09122C]"
              >
                <p className="text-white font-extralight bg-[#44BC19] w-fit px-2 py-[1px] rounded-sm">{item.category}</p>
                <div className="flex flex-col gap-0">
                  <p className="text-white font-bold">{item.title}</p>
                  <p className="text-gray-400 font-light">{item.description}</p>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-10">
                    <p className="text-[#6E6E6E]">{item.type}</p>
                    <p className="text-[#6E6E6E]">{item.location}</p>
                    <p className="text-[#6E6E6E]">{item.salary}</p>
                  </div>
                  <div className="flex gap-1 pr-10">
                    <a href="#" className="text-[#44BC19] hover:underline">view job</a>
                  </div>
                </div>
              </div>
            );
        })}

       </div>
    </div>
    );
}