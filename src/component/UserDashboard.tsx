/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Save, LogOut, Plus, XCircle } from 'lucide-react';
import { FileInput } from './FileInput';
import { InputField } from './InputField';
import { SectionCard } from './SectionCard';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebaseClient';


// ============= INTERFACES =============
interface Education {
  twelthBoard: string;
  twelthPercentage: string;
  twelthYear: string;
  collegeName: string;
  degree: string;
  cgpa: string;
  graduationYear: string;
}

interface WorkExperience {
  id: string;
  organization: string;
  years: string;
  designation: string;
  experienceLetter: File | null;
}

interface Certification {
  id: string;
  title: string;
  authority: string;
  issueDate: string;
  certificate: File | null;
}

interface Achievement {
  id: string;
  description: string;
  certificate: File | null;
}
interface Resume{
  resume: File|null;
}

interface ProfileData {
  name: string;
  email: string;
  dob: string;
  profilePicture: File | null;
  education: Education;
  workExperiences: WorkExperience[];
  linkedin: string;
  github: string;
  certifications: Certification[];
  achievements: Achievement[];
  savedFirst:boolean
  resume:Resume
}




const Dashboard: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editSections, setEditSections] = useState<Record<string, boolean>>({
    profile: false,
    education: false,
    social: false,
  });
  const user=auth.currentUser;
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    dob: '',
    profilePicture: null,
    education: {
      twelthBoard: '',
      twelthPercentage: '',
      twelthYear: '',
      collegeName: '',
      degree: '',
      cgpa: '',
      graduationYear: '',
    },
    workExperiences: [],
    linkedin: '',
    github: '',
    certifications: [],
    achievements: [],
    savedFirst:true,
    resume:{resume:null}
  });


   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/user_info/profile?uid=${user?.uid}`);
        if (res.data.ok && res.data.data) {
          setProfileData(res.data.data); 
          setIsSaved(res.data.data.savedFirst);
        } else {
          console.log("No profile data found, user is new.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } 
    };

    fetchProfile();
  }, [user?.uid]);

  const markChanges = () => setHasChanges(true);

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // ============= HANDLERS =============
  const handleChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    markChanges();
    clearError(field);
  };

  const handleEducationChange = (field: keyof Education, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      education: { ...prev.education, [field]: value },
    }));
    markChanges();
    clearError(`education.${field}`);
  };

  const toggleEditSection = (section: string) => {
    setEditSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Work Experience Handlers
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      organization: '',
      years: '',
      designation: '',
      experienceLetter: null,
    };
    setProfileData((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newExp],
    }));
    markChanges();
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
    markChanges();
    clearError(`work.${id}.${field}`);
  };

  const removeWorkExperience = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((exp) => exp.id !== id),
    }));
    markChanges();
  };

  // Certification Handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: '',
      authority: '',
      issueDate: '',
      certificate: null,
    };
    setProfileData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
    markChanges();
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
    markChanges();
    clearError(`cert.${id}.${field}`);
  };

  const removeCertification = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
    markChanges();
  };

  // Achievement Handlers
  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      description: '',
      certificate: null,
    };
    setProfileData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAch],
    }));
    markChanges();
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach) =>
        ach.id === id ? { ...ach, [field]: value } : ach
      ),
    }));
    markChanges();
    clearError(`ach.${id}.${field}`);
  };

  const removeAchievement = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((ach) => ach.id !== id),
    }));
    markChanges();
  };

  const updateResume = (file: File | null) => {
  setProfileData((prev) => ({
    ...prev,
    resume: { resume: file },
  }));
  markChanges();
  };

  const removeResume = () => {
  setProfileData((prev) => ({
    ...prev,
    resume: { resume: null },
  }));
  markChanges();
};

  // Validation
  // const validateForm = (): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   if (!profileData.name.trim()) newErrors.name = 'Name is mandatory';
  //   if (!profileData.email.trim()) newErrors.email = 'Email is mandatory';
  //   if (!profileData.dob) newErrors.dob = 'Date of Birth is mandatory';

  //   Object.entries(profileData.education).forEach(([key, value]) => {
  //     if (!value.trim()) newErrors[`education.${key}`] = `${key} is mandatory`;
  //   });

  //   profileData.workExperiences.forEach((exp) => {
  //     if (!exp.organization.trim()) newErrors[`work.${exp.id}.organization`] = 'Required';
  //     if (!exp.years.trim()) newErrors[`work.${exp.id}.years`] = 'Required';
  //     if (!exp.designation.trim()) newErrors[`work.${exp.id}.designation`] = 'Required';
  //     if (!exp.experienceLetter) newErrors[`work.${exp.id}.experienceLetter`] = 'Required';
  //   });

  //   if (!profileData.linkedin.trim()) newErrors.linkedin = 'LinkedIn is mandatory';
  //   if (!profileData.github.trim()) newErrors.github = 'GitHub is mandatory';

  //   profileData.certifications.forEach((cert) => {
  //     if (!cert.title.trim()) newErrors[`cert.${cert.id}.title`] = 'Required';
  //     if (!cert.authority.trim()) newErrors[`cert.${cert.id}.authority`] = 'Required';
  //     if (!cert.issueDate) newErrors[`cert.${cert.id}.issueDate`] = 'Required';
  //     if (!cert.certificate) newErrors[`cert.${cert.id}.certificate`] = 'Required';
  //   });

  //   profileData.achievements.forEach((ach) => {
  //     if (!ach.description.trim()) newErrors[`ach.${ach.id}.description`] = 'Required';
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  const today = new Date();

  if (!profileData.name.trim()) newErrors.name = "Name is mandatory";

  if (!profileData.email.trim()) newErrors.email = "Email is mandatory";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))
    newErrors.email = "Invalid email format";

  if (!profileData.dob) newErrors.dob = "Date of Birth is mandatory";
  else if (new Date(profileData.dob) > today)
    newErrors.dob = "Date of Birth cannot be in the future";

  Object.entries(profileData.education).forEach(([key, value]) => {
    if (!value.trim()) newErrors[`education.${key}`] = `${key} is mandatory`;
  });

  profileData.workExperiences.forEach((exp) => {
    if (!exp.organization.trim()) newErrors[`work.${exp.id}.organization`] = "Required";
    if (!exp.years.trim()) newErrors[`work.${exp.id}.years`] = "Required";
    else if (isNaN(Number(exp.years)) || Number(exp.years) <= 0)
      newErrors[`work.${exp.id}.years`] = "Years must be positive";
    if (!exp.designation.trim()) newErrors[`work.${exp.id}.designation`] = "Required";
    if (!exp.experienceLetter)
      newErrors[`work.${exp.id}.experienceLetter`] = "Experience letter required";
  });

  if (!profileData.linkedin.trim()) newErrors.linkedin = "LinkedIn is mandatory";
  if (!profileData.github.trim()) newErrors.github = "GitHub is mandatory";

  profileData.certifications.forEach((cert) => {
    if (!cert.title.trim()) newErrors[`cert.${cert.id}.title`] = "Title required";
    if (!cert.authority.trim()) newErrors[`cert.${cert.id}.authority`] = "Authority required";
    if (!cert.issueDate) newErrors[`cert.${cert.id}.issueDate`] = "Issue date required";
    else if (new Date(cert.issueDate) > today)
      newErrors[`cert.${cert.id}.issueDate`] = "Issue date cannot be in the future";
    if (!cert.certificate)
      newErrors[`cert.${cert.id}.certificate`] = "Certificate file required";
  });

  profileData.achievements.forEach((ach) => {
    if (!ach.description.trim())
      newErrors[`ach.${ach.id}.description`] = "Required";
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async () => {
    if (!validateForm()) return;
    if(!user) return;
    const formData = new FormData();
    // formData.append("uid", profileData.uid || "12345");
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("github", profileData.github);
    formData.append("linkedin", profileData.linkedin);
    formData.append("dob", profileData.dob);
    if (profileData.resume && profileData.resume.resume instanceof File) {
          formData.append("resume", profileData.resume.resume);
    }


    // Education (convert object -> string)
    formData.append("education", JSON.stringify(profileData.education));

    // Work experiences (loop)
    profileData.workExperiences.forEach((exp, index) => {
      formData.append(`workExperiences[${index}][organization]`, exp.organization);
      formData.append(`workExperiences[${index}][designation]`, exp.designation);
      formData.append(`workExperiences[${index}][years]`, exp.years);

      // Attach file if exists
      if (exp.experienceLetter instanceof File) {
        formData.append(`workExperiences[${index}][experienceLetter]`, exp.experienceLetter);
      }
    });

    // Certifications (loop)
    profileData.certifications.forEach((cert, index) => {
      formData.append(`certifications[${index}][title]`, cert.title);
      formData.append(`certifications[${index}][authority]`, cert.authority);
      formData.append(`certifications[${index}][issueDate]`, cert.issueDate);

      if (cert.certificate instanceof File) {
        formData.append(`certifications[${index}][certificate]`, cert.certificate);
      }
    });

    // Achievements (optional)
    profileData.achievements.forEach((ach, index) => {
      formData.append(`achievements[${index}][title]`, ach.description);

      if (ach.certificate instanceof File) {
        formData.append(`achievements[${index}][certificate]`, ach.certificate);
      }

    });

    formData.append("userUid", user.uid);
    // formData.append("profileData", JSON.stringify(profileData));
    // console.log(profileData);
    // console.log(formData.get("profileData"));
    try {
      const res = await axios.post("/api/user_info/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.ok) {
        alert("Profile submitted successfully!");
        setIsSaved(true);
        setHasChanges(false);
        setEditSections({ profile: false, education: false, social: false });
      } else {
        alert(`Error: ${res.data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit profile.");
    }
  };

  const handleSignOut = async() => {
    if (window.confirm('Are you sure you want to sign out?')) {
    await signOut(auth);
    }
  };

  // ============= RENDER METHODS =============
  const renderProfileSection = () => {
    const isEditing = !isSaved || editSections.profile;

    if (!isEditing) {
      return (
        <SectionCard title="Profile Information" showEdit onEdit={() => toggleEditSection('profile')}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                {profileData.profilePicture ? (
                  <Image src={URL.createObjectURL(profileData.profilePicture)} alt="Profile" className="w-full h-full object-cover" width={100} height={100} />
                ) : (
                  <User size={48} className="text-gray-500" />
                )}
              </div>
            </div> */}
            <div className="md:col-span-3 space-y-3">
              <div><span className="font-semibold text-gray-300">Name:</span> <span className="text-gray-400 ml-2">{profileData.name}</span></div>
              <div><span className="font-semibold text-gray-300">Email:</span> <span className="text-gray-400 ml-2">{profileData.email}</span></div>
              <div><span className="font-semibold text-gray-300">Date of Birth:</span> <span className="text-gray-400 ml-2">{profileData.dob}</span></div>
            </div>
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard title="Profile Information">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> */}
          {/* <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 overflow-hidden border-2 border-gray-600">
              {profileData.profilePicture ? (
                <Image src={URL.createObjectURL(profileData.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-500" />
              )}
            </div>
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
              <Upload size={16} />
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleChange('profilePicture', e.target.files[0]); }} />
            </label>
          </div> */}
          {/* <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4"> */}
            <InputField label="Name" value={profileData.name} onChange={(v) => handleChange('name', v)} error={errors.name} required />
            <InputField label="Email" value={profileData.email} onChange={(v) => handleChange('email', v)} type="email" error={errors.email} required />
            <InputField label="Date of Birth" value={profileData.dob} onChange={(v) => handleChange('dob', v)} type="date" error={errors.dob} required />
          {/* </div> */}
        {/* </div> */}
      </SectionCard>
    );
  };

  const renderEducationSection = () => {
    const isEditing = !isSaved || editSections.education;

    if (!isEditing) {
      return (
        <SectionCard title="Education" showEdit onEdit={() => toggleEditSection('education')}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">12th Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><span className="font-semibold text-gray-300">Board:</span> <span className="text-gray-400 ml-2">{profileData.education.twelthBoard}</span></div>
                <div><span className="font-semibold text-gray-300">Percentage:</span> <span className="text-gray-400 ml-2">{profileData.education.twelthPercentage}%</span></div>
                <div><span className="font-semibold text-gray-300">Year:</span> <span className="text-gray-400 ml-2">{profileData.education.twelthYear}</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">College Degree</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="font-semibold text-gray-300">College:</span> <span className="text-gray-400 ml-2">{profileData.education.collegeName}</span></div>
                <div><span className="font-semibold text-gray-300">Degree:</span> <span className="text-gray-400 ml-2">{profileData.education.degree}</span></div>
                <div><span className="font-semibold text-gray-300">CGPA:</span> <span className="text-gray-400 ml-2">{profileData.education.cgpa}</span></div>
                <div><span className="font-semibold text-gray-300">Year:</span> <span className="text-gray-400 ml-2">{profileData.education.graduationYear}</span></div>
              </div>
            </div>
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard title="Education">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">12th Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Board" value={profileData.education.twelthBoard} onChange={(v) => handleEducationChange('twelthBoard', v)} error={errors['education.twelthBoard']} required />
              <InputField label="Percentage" value={profileData.education.twelthPercentage} onChange={(v) => handleEducationChange('twelthPercentage', v)} error={errors['education.twelthPercentage']} required />
              <InputField label="Year" value={profileData.education.twelthYear} onChange={(v) => handleEducationChange('twelthYear', v)} error={errors['education.twelthYear']} required />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">College Degree</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="College Name" value={profileData.education.collegeName} onChange={(v) => handleEducationChange('collegeName', v)} error={errors['education.collegeName']} required />
              <InputField label="Degree" value={profileData.education.degree} onChange={(v) => handleEducationChange('degree', v)} error={errors['education.degree']} required />
              <InputField label="CGPA" value={profileData.education.cgpa} onChange={(v) => handleEducationChange('cgpa', v)} error={errors['education.cgpa']} required />
              <InputField label="Graduation Year" value={profileData.education.graduationYear} onChange={(v) => handleEducationChange('graduationYear', v)} error={errors['education.graduationYear']} required />
            </div>
          </div>
        </div>
      </SectionCard>
    );
  };

 const renderWorkExperience = () => {
  const isEditing = !isSaved || editSections.workExperience;

  if (!isEditing) {
    return (
      <SectionCard title="Work Experience" showEdit onEdit={() => toggleEditSection('workExperience')}>
        <div className="space-y-4">
          {profileData.workExperiences.length === 0 ? (
            <p className="text-gray-400">No work experiences added yet.</p>
          ) : (
            profileData.workExperiences.map((exp) => (
              <div key={exp.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">{exp.designation || 'Experience Entry'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="font-semibold text-gray-300">Organization:</span> <span className="text-gray-400 ml-2">{exp.organization}</span></div>
                  <div><span className="font-semibold text-gray-300">Years:</span> <span className="text-gray-400 ml-2">{exp.years}</span></div>
                  <div><span className="font-semibold text-gray-300">Designation:</span> <span className="text-gray-400 ml-2">{exp.designation}</span></div>
                </div>
                <p className="text-sm text-green-400 mt-3">📄 Proof already uploaded for this proficiency</p>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Work Experience"
      extraButton={
        <button
          onClick={addWorkExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      }
    >
      <div className="space-y-4">
        {profileData.workExperiences.map((exp) => (
          <div key={exp.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Experience Entry</h3>
              <button onClick={() => removeWorkExperience(exp.id)} className="text-red-400 hover:text-red-300 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Organization" value={exp.organization} onChange={(v) => updateWorkExperience(exp.id, 'organization', v)} error={errors[`work.${exp.id}.organization`]} required />
              <InputField label="Years" value={exp.years} onChange={(v) => updateWorkExperience(exp.id, 'years', v)} error={errors[`work.${exp.id}.years`]} required />
              <InputField label="Designation" value={exp.designation} onChange={(v) => updateWorkExperience(exp.id, 'designation', v)} error={errors[`work.${exp.id}.designation`]} required />
              <FileInput label="Experience Letter" file={exp.experienceLetter} onChange={(f) => updateWorkExperience(exp.id, 'experienceLetter', f)} error={errors[`work.${exp.id}.experienceLetter`]} required />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};


  const renderSocialLinks = () => {
    const isEditing = !isSaved || editSections.social;

    if (!isEditing) {
      return (
        <SectionCard title="Social Links" showEdit onEdit={() => toggleEditSection('social')}>
          <div className="space-y-3">
            <div><span className="font-semibold text-gray-300">LinkedIn:</span> <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-2">{profileData.linkedin}</a></div>
            <div><span className="font-semibold text-gray-300">GitHub:</span> <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-2">{profileData.github}</a></div>
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard title="Social Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="LinkedIn" value={profileData.linkedin} onChange={(v) => handleChange('linkedin', v)} type="url" placeholder="https://linkedin.com/in/..." error={errors.linkedin} required />
          <InputField label="GitHub" value={profileData.github} onChange={(v) => handleChange('github', v)} type="url" placeholder="https://github.com/..." error={errors.github} required />
        </div>
      </SectionCard>
    );
  };

  const renderCertifications = () => {
  const isEditing = !isSaved || editSections.certifications;

  if (!isEditing) {
    return (
      <SectionCard title="Certifications" showEdit onEdit={() => toggleEditSection('certifications')}>
        <div className="space-y-4">
          {profileData.certifications.length === 0 ? (
            <p className="text-gray-400">No certifications added yet.</p>
          ) : (
            profileData.certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">{cert.title || 'Certification Entry'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="font-semibold text-gray-300">Authority:</span> <span className="text-gray-400 ml-2">{cert.authority}</span></div>
                  <div><span className="font-semibold text-gray-300">Issue Date:</span> <span className="text-gray-400 ml-2">{cert.issueDate}</span></div>
                </div>
                <p className="text-sm text-green-400 mt-3">📄 Proof already uploaded for this certification</p>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Certifications"
      extraButton={
        <button
          onClick={addCertification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      }
    >
      <div className="space-y-4">
        {profileData.certifications.map((cert) => (
          <div key={cert.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Certification Entry</h3>
              <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-300 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Title" value={cert.title} onChange={(v) => updateCertification(cert.id, 'title', v)} error={errors[`cert.${cert.id}.title`]} required />
              <InputField label="Issuing Authority" value={cert.authority} onChange={(v) => updateCertification(cert.id, 'authority', v)} error={errors[`cert.${cert.id}.authority`]} required />
              <InputField label="Date of Issue" value={cert.issueDate} onChange={(v) => updateCertification(cert.id, 'issueDate', v)} type="date" error={errors[`cert.${cert.id}.issueDate`]} required />
              <FileInput label="Certificate File" file={cert.certificate} onChange={(f) => updateCertification(cert.id, 'certificate', f)} error={errors[`cert.${cert.id}.certificate`]} required />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
  };


  const renderAchievements = () => {
    const isEditing = !isSaved || editSections.achievements;

    if (!isEditing) {
      return (
        <SectionCard title="Achievements & Research Papers" showEdit onEdit={() => toggleEditSection('achievements')}>
          <div className="space-y-4">
            {profileData.achievements.length === 0 ? (
              <p className="text-gray-400">No achievements added yet.</p>
            ) : (
              profileData.achievements.map((ach) => (
                <div key={ach.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">Achievement Entry</h3>
                  <p className="text-gray-400 mb-2">{ach.description}</p>
                  <p className="text-sm text-green-400">📄 Proof already uploaded for this achievement</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard
        title="Achievements & Research Papers"
        extraButton={
          <button
            onClick={addAchievement}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        }
      >
        <div className="space-y-4">
          {profileData.achievements.map((ach) => (
            <div key={ach.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Achievement Entry</h3>
                <button onClick={() => removeAchievement(ach.id)} className="text-red-400 hover:text-red-300 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={ach.description}
                    onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors[`ach.${ach.id}.description`] && <p className="text-red-400 text-xs mt-1">{errors[`ach.${ach.id}.description`]}</p>}
                </div>
                <FileInput label="Certificate File (Optional)" file={ach.certificate} onChange={(f) => updateAchievement(ach.id, 'certificate', f)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  const renderResume = () => {
  const isEditing = !isSaved || editSections.resume;

  if (!isEditing) {
    return (
      <SectionCard
        title="Resume"
        showEdit
        onEdit={() => toggleEditSection("resume")}
      >
        {profileData.resume?.resume ? (
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-750 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-1">
                Uploaded Resume
              </h3>
              <p className="text-gray-400">{profileData.resume.resume.name}</p>
            </div>
            <div className="flex gap-2">
              <p> Resume Uploaded Successfully</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No resume uploaded yet.</p>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Resume">
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-750">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Upload Resume
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              updateResume(file);
            }}
            className="text-gray-300 file:mr-3 file:bg-blue-600 file:text-white file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:cursor-pointer hover:file:bg-blue-700 transition-colors"
          />
          <p className="text-gray-500 text-sm">
            Upload your latest resume (PDF)
          </p>
        </div>
        {profileData.resume?.resume && (
          <div className="mt-4">
            <p className="text-gray-400 mb-2">
              Current file: {profileData.resume.resume.name}
            </p>
            <button
              onClick={() => removeResume()}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  );
};




  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-linear-to-r from-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ramdeobaba University</h1>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg">
                <Save size={18} />
                Save Info
              </button>
            )}
            <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {renderProfileSection()}
        {renderEducationSection()}
        {renderWorkExperience()}
        {renderSocialLinks()}
        {renderCertifications()}
        {renderAchievements()}
        {renderResume()}
      </main>
    </div>
  );
};

export default Dashboard;