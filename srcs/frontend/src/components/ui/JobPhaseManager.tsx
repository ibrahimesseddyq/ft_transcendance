import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, FlaskConical, CheckCircle2 } from 'lucide-react';
import { mainApi, quizApi } from '@/utils/Api';
import Notification from '@/utils/TostifyNotification';

interface JobPhase {
  id?: string;
  _id?: string;
  name: string;
  phaseType: 'test';
  description?: string;
  orderIndex: number;
  isRequired: boolean;
  durationMinutes?: number;
  testId: string;
}

interface AvailableTest {
  id?: string;
  _id?: string;
  title: string;
}

interface Props {
  jobId: string;
}

const defaultForm = {
  name: '',
  description: '',
  durationMinutes: '',
  testId: '',
  phaseId: '',
  isRequired: true,
};

const env_main_api = import.meta.env.VITE_MAIN_API_URL;
const env_quiz_api = import.meta.env.VITE_QUIZ_API_URL;

export function JobPhaseManager({ jobId }: Props) {
  const [open, setOpen] = useState(false);
  const [phases, setPhases] = useState<JobPhase[]>([]);
  const [availableTests, setAvailableTests] = useState<AvailableTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [phasesRes, testsRes] = await Promise.all([
        mainApi.get(`${env_main_api}/jobPhases/${jobId}/phase`),
        quizApi.get(`${env_quiz_api}/tests`)
      ]);
      
      const pData = phasesRes.data?.data ?? phasesRes.data;
      const tData = testsRes.data?.data ?? testsRes.data;
      
      setPhases(Array.isArray(pData) ? pData : []);
      setAvailableTests(Array.isArray(tData) ? tData : []);
    } catch {
      console.log('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const handleDelete = async (phaseId: string | undefined) => {
    if (!phaseId)
      return Notification('Invalid phase ID', 'error');
    if (!confirm('Remove this test phase?')) 
      return;

    setPhases(prev => prev.filter(p => p.id !== phaseId && p._id !== phaseId));
    
    try {
      await mainApi.delete(`${env_main_api}/jobPhases/${phaseId}`);
      Notification('Phase deleted', 'success');
    } catch {
      fetchData(); 
      Notification('Failed to delete phase', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.testId) {
      Notification('Please select a test and provide a name', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        jobId,
        name: form.name.trim(),
        phaseType: 'test',
        description: form.description.trim() || undefined,
        orderIndex: phases.length + 1,
        isRequired: form.isRequired,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
        testId: form.testId,
      };
      const res = await mainApi.post(`${env_main_api}/jobPhases/`, payload);
      
      setPhases(prev => [...prev, (res.data?.data ?? res.data)]);
      setForm(defaultForm);
      setShowForm(false);
      Notification('Test phase linked', 'success');
    } catch (err: any) {
      Notification('Error linking test phase', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-gray-100 dark:border-slate-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex gap-2 items-center justify-between text-xs font-semibold 
          text-gray-500 dark:text-gray-400 hover:text-[#10B77F] transition-colors w-full"
      >
        <span className="flex items-center gap-1">
          <FlaskConical size={13} className="text-[#10B77F]" />
          Assigned Test
          {phases.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#10B77F]/10 text-[#10B77F] text-[10px] font-bold">
              {phases.length}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {loading ? (
            <div className="flex justify-center py-3">
              <Loader2 size={16} className="animate-spin text-[#10B77F]" />
            </div>
          ) : (
            <>
              {phases.length > 0 && (
                <ul className="flex flex-col gap-1.5 mb-1">
                  {phases.map((phase) => {
                    const uniqueId = phase.id || phase._id;
                    return (
                      <li key={uniqueId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 group">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 size={12} className="text-[#10B77F] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{phase.name}</p>
                            <p className="text-[10px] text-gray-400 italic">Linked to Quiz ID: {phase.testId?.slice(0, 8)}...</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(uniqueId);
                          }} 
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {phases.length === 0 && (
                <>
                  {!showForm && (
                    <p className="text-xs text-gray-400 text-center py-2 mb-1">No test assigned yet.</p>
                  )}

                  {showForm ? (
                    <form onSubmit={handleSubmit}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-dashed border-[#10B77F]/40 bg-[#10B77F]/5">
                      <select 
                        required 
                        value={form.testId}
                        onChange={e => {
                            const selectedTest = availableTests.find(t => (t.id || t._id) === e.target.value);
                            setForm(f => ({ ...f, testId: e.target.value, name: selectedTest?.title || f.name }));
                        }}
                        className="h-8 w-full text-xs px-2 rounded-lg text-black dark:text-white border border-gray-200 
                          dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-[#10B77F]"
                      >
                        <option value="">-- Select a Test --</option>
                        {availableTests.map(test => {
                          const testUniqueId = test.id || test._id;
                          return (
                            <option key={testUniqueId} value={testUniqueId}>{test.title}</option>
                          )
                        })}
                      </select>

                      <div className="flex gap-2">
                        <button type="submit" disabled={submitting} className="flex-1 h-8 text-xs font-bold rounded-lg bg-[#10B77F] text-white hover:bg-[#0da371] disabled:opacity-50 transition-colors">
                          {submitting ? 'Saving...' : 'Assign Test'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="h-8 px-3 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowForm(true)} 
                    className="flex items-center justify-center gap-1 w-full h-8 rounded-lg border
                     border-dashed border-gray-300 dark:border-slate-700 text-xs 
                     text-gray-400 hover:border-[#10B77F] hover:text-[#10B77F] transition-colors">
                      <Plus size={13} /> Link Quiz
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}