import TestTakingArea from '@/components/ui/TestTakingArea'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mainApi } from '@/utils/Api'

export function UserPhase(){
    const { phaseId } = useParams(); 
    const navigate = useNavigate();
    const [testId, setTestId] = useState("");
    const [testData, steTestData] = useState([]);
    const [candidateId, setCondidateId] = useState("");
    const [currentphaseId, setCurrentphaseId] = useState("");
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(() => {
        const fetchPhase = async () => {
          try {
            // setIsLoading(true);
            const res = await mainApi.get(`${env_main_api}/applications/${phaseId}/phase`);
            console.log("userPhase = ", res.data);
            if(res.data && res.data.jobPhase){
                setTestId(res.data.jobPhase.testId);
                setCondidateId();
                setCurrentphaseId();
            }
    
          } catch (err) {
            console.error("Failed to fetch fetch phase:", err);
          } finally {
            // setIsLoading(false);
          }
        };
        const fetchTest = async () => {
          try {
            // setIsLoading(true);
            const res = await mainApi.get(`${env_main_api}/applications/tests/${testId}/start`);
            if(res.data){
                steTestData(res.data);
            }
    
          } catch (err) {
            console.error("Failed to fetch fetch phase:", err);
          } finally {
            // setIsLoading(false);
          }
        };
        if (phaseId) 
            fetchPhase();
        if (testId)
            fetchTest();
    }, [phaseId]);

    return (
        <div>
            {/**
             * testData, candidateId, phaseId 
             */}
            {/* <TestTakingArea testData={testData} phaseId={} testId={testId}/> */}
             <TestTakingArea testId={testId}/>
        </div>
    );
}