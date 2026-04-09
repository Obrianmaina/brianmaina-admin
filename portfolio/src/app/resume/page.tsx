"use client"; 

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, FileText, Lock } from "lucide-react"; 
import Button from "@/components/ui/button";
import Timeline from "@/components/Timeline";
import { TimelineSection } from "@/types";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";

export default function ResumePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [requestMessage, setRequestMessage] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [experienceData, setExperienceData] = useState<TimelineSection[]>([]);
  const [educationData, setEducationData] = useState<TimelineSection[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingResume, setLoadingResume] = useState(true);
  
  // Secure dynamic references state
  const [references, setReferences] = useState<{name: string, title: string, email?: string, phone?: string}[]>([]);

  // New states for popup and modal
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasDismissedToast, setHasDismissedToast] = useState(false);
  const scrollTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch('/api/admin/resume');
        if (res.ok) {
          const data = await res.json();
          setExperienceData(data.experience || []);
          setEducationData(data.education || []);
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error("Failed to load resume data");
      } finally {
        setLoadingResume(false);
      }
    };
    fetchResume();
  }, []);

  // Trigger the toast when scrolling down to the skills section
  useEffect(() => {
    if (loadingResume) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDismissedToast) {
          setShowToast(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollTriggerRef.current) {
      observer.observe(scrollTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [loadingResume, hasDismissedToast]);

  const trackDownload = () => {
    if (!unlocked) {
      setIsVerifyModalOpen(true);
      return;
    }

    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ target: 'resume-pdf', type: 'download' }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    window.open('https://res.cloudinary.com/dsvexizbx/image/upload/v1772809322/Brian_Maina_CV_iwphxv.pdf', '_blank');
  };

  const handleRequestCode = async () => {
    setRequestState('loading');
    setRequestMessage('');
    try {
      const response = await fetch('/api/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send code.');
      setRequestState('success');
      setRequestMessage('Success! Please check your email for the access code.');
    } catch (err: unknown) {
      setRequestMessage(err instanceof Error ? err.message : 'An unknown error occurred.');
      setRequestState('error');
    }
  };

  const handleUnlock = async () => {
    setUnlockError("");
    setUnlockLoading(true);
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUnlocked(true);
        setUnlockError("");
        setReferences(data.references || []); 
        setIsVerifyModalOpen(false); 
        setShowToast(true); 
      } else {
        setUnlockError(data.message || "Incorrect code.");
      }
    } catch (error) {
      setUnlockError("An error occurred during verification.");
    } finally {
      setUnlockLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-transparent dark:border-gray-800 overflow-hidden p-8 transition-colors duration-300"
            >
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <FileText size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Unlock CV & References</h3>
                <p className="text-gray-600 dark:text-gray-400">Verify your email address to access reference contacts and unlock the PDF download.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email address" 
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500" 
                    disabled={requestState === 'loading'} 
                  />
                  <Button onClick={handleRequestCode} disabled={requestState === 'loading' || !email}>
                    {requestState === 'loading' ? 'Sending...' : 'Request Code'}
                  </Button>
                </div>
                {requestMessage && <p className={`text-sm text-center font-medium ${requestState === 'error' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{requestMessage}</p>}
                
                {requestState === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6 transition-colors">
                    <input 
                      type="text" 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)} 
                      placeholder="6-digit code" 
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500" 
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    />
                    <Button onClick={handleUnlock} disabled={unlockLoading || !code}>
                      {unlockLoading ? 'Verifying...' : 'Verify & Unlock'}
                    </Button>
                  </motion.div>
                )}
                {unlockError && <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">{unlockError}</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && !isVerifyModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className="fixed bottom-28 sm:bottom-6 right-4 sm:right-6 z-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl dark:shadow-xl rounded-2xl p-5 max-w-[320px] flex gap-4 items-start transition-colors duration-300"
          >
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center shrink-0 transition-colors">
              <FileText size={20} />
            </div>
            <div className="flex-1 pr-4">
              {unlocked ? (
                <>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Verification Complete</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">You can now download the CV PDF.</p>
                  <button
                    onClick={trackDownload}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-md shadow-teal-100 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm">Want a copy?</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Verify your email to download my CV and view references.</p>
                  <button
                    onClick={() => {
                      setShowToast(false);
                      setIsVerifyModalOpen(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-md shadow-teal-100 dark:shadow-none"
                  >
                    Verify Email
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setShowToast(false);
                setHasDismissedToast(true);
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden pt-24 transition-colors duration-300">
        {loadingResume ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-teal-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin mb-4 transition-colors"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading Curriculum Vitae...</p>
          </div>
        ) : (
          <section id="cv" className="relative max-w-5xl mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                Curriculum Vitae
              </motion.h1>
              
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Button 
                  onClick={trackDownload} 
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-lg border-none dark:text-white transition-all"
                >
                  <Download size={18} />
                  {unlocked ? "Download CV" : "Verify Email to Download"}
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.5 }} 
              className="mb-10"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-teal-500 before:rounded-full transition-colors">
                Professional Summary
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                Results-oriented Visual Designer and AFRIKA KOMMT! alumni with experience creating compelling visual solutions for global brands like SAP. Skilled in designing UI components, multimedia assets, long-form document layout, editorial design and marketing collateral for diverse campaigns. Complemented by a foundational year of Computer Science study at DHBW Mosbach, which enhances the creation of practical, buildable designs and collaboration with development teams.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 transition-colors">
                <li>Address: Kikuyu, Kenya</li>
                <li>Email: brianmaina.nyawira@gmail.com</li>
                <li>
                  LinkedIn: <a href="https://www.linkedin.com/in/brian-maina-nyawira" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">linkedin.com/in/brian-maina-nyawira</a>
                </li>
                <li>Primary Phone: +254 728 036 420</li>
                <li>Secondary Phone: +49 15172371222</li>
                <li>Nationality: Kenyan</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.5 }} 
              className="grid md:grid-cols-2 gap-10"
            >
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-teal-500 before:rounded-full transition-colors">
                  Experience
                </h2>
                <Timeline sections={experienceData} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-teal-500 before:rounded-full transition-colors">
                  Education
                </h2>
                <Timeline sections={educationData} />
              </div>
            </motion.div>

            <motion.div 
              ref={scrollTriggerRef}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.5 }} 
              className="mt-10"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-teal-500 before:rounded-full transition-colors">
                Skills and Technologies
              </h2>
              <ul className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  skill === "AI" ? (
                    <li key={skill} className="relative group px-4 py-2 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 rounded-full text-sm cursor-pointer font-semibold transition-colors">
                      AI
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        I leverage AI to accelerate ideation and streamline workflows, freeing up time for high-level creative problem solving. While AI is a fantastic assistant, my final designs are always driven by human intuition and carefully crafted to meet specific client goals.
                        <svg className="absolute text-gray-800 dark:text-gray-100 h-2 w-full left-0 top-full transition-colors" x="0px" y="0px" viewBox="0 0 255 255">
                            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                        </svg>
                      </div>
                    </li>
                  ) : (
                    <li key={skill} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-full text-sm transition-colors">{skill}</li>
                  )
                ))}
              </ul>
            </motion.div>
          </section>
        )}

        <motion.section id="references" className="relative max-w-5xl mx-auto py-20 px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-teal-500 before:rounded-full transition-colors">
            References
          </h2>
          {!unlocked ? (
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-12">
               <div className="w-16 h-16 bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6 transition-colors">
                  <Lock size={32} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">References are locked</h3>
               <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Please verify your email address to access reference contacts and unlock the PDF download.</p>
               <Button onClick={() => setIsVerifyModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 border-none text-white dark:text-white px-8 py-3 rounded-xl shadow-md transition-all">
                 Verify Email to Unlock
               </Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p className="text-gray-900 dark:text-gray-100 mb-6 font-medium">Verification successful! Reference details are now visible and your download is unlocked.</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {references.map((ref, index) => (
                  <li key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors">
                    <h4 className="font-bold text-gray-900 dark:text-gray-50 text-lg mb-1">{ref.name}</h4>
                    <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-3">{ref.title}</p>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {ref.email && <p><span className="font-medium text-gray-500 dark:text-gray-500">Email:</span> {ref.email}</p>}
                      {ref.phone && <p><span className="font-medium text-gray-500 dark:text-gray-500">Phone:</span> {ref.phone}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.section>

        
      </main>
    </>
  );
}