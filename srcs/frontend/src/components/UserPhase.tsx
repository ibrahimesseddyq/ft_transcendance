import TestTakingArea from '@/components/ui/TestTakingArea'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mainApi } from '@/utils/Api'

export function UserPhase(){
    const { phaseId } = useParams(); 
    const navigate = useNavigate();
    const [userPhase, setUserPhase] = useState([]);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(() => {
        const fetchPhase = async () => {
          try {
            // setIsLoading(true);
            const res = await mainApi.get(`${env_main_api}/applications/${phaseId}/phase`);
            console.log("userPhase = ", res.data);
            setUserPhase(res.data);
            // const appData = appRes.data.data || appRes.data;
    
            // if (appData?.candidateId) {
            //   try {
            //     const userRes = await mainApi.get(`${env_main_api}/users/${appData.candidateId}`);
            //     appData.candidate = userRes.data.data || userRes.data;
            //   } catch (userErr) {
            //     console.error("Failed to fetch candidate details:", userErr);
            //   }
            // }
            // setDetails(appData);
    
          } catch (err) {
            console.error("Failed to fetch fetch phase:", err);
          } finally {
            // setIsLoading(false);
          }
        };
    
        if (phaseId) fetchPhase();
      }, [phaseId]);
    return (
        <div>
            
        </div>
    );
}