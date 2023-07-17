import React, { useState, useEffect,  } from 'react';
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {
  const [jobData, setJobData] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState(null);
  const [skillsRating, setSkillsRating] = useState([]);
  const [qualificationChartData, setQualificationChartData] = useState(null);

  useEffect(() => {
    fetch('/jobData.json')
      .then(response => response.json())
      .then(data => {
        setJobData(data);
      })
      .catch(error => {
        console.error('Error fetching job data:', error);
      });
  }, []);

  const handleJobRoleSelection = (jobRole) => {
    setSelectedJobRole(jobRole);
    setSkillsRating(jobRole.skills.map(skill => ({ name: skill.name, level: 0 })));
  };

  const handleSkillRating = (skillIndex, rating) => {
    setSkillsRating(prevState => {
      const updatedSkills = [...prevState];
      updatedSkills[skillIndex].level = rating;
      return updatedSkills;
    });
  };

  const calculateQualification = () => {
    const qualification = skillsRating.reduce((total, skill) => total + skill.level, 0) / skillsRating.length;

    setQualificationChartData({
      labels: skillsRating.map(skill => skill.name),
      datasets: [
        {
          label: 'Qualification',
          data: skillsRating.map(skill => skill.level),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Your Qualification',
          data: skillsRating.map(skill => qualification),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div>
      <h2>Select a Job Role:</h2>
      {jobData.map(job => (
        <button key={job.id} onClick={() => handleJobRoleSelection(job)}>
          {job.title}
        </button>
      ))}

      {selectedJobRole && (
        <>
          <h2>Rate Your Skills:</h2>
          {skillsRating.map((skill, index) => (
            <div key={index}>
              <label htmlFor={`skill-${index}`}>{skill.name}:</label>
              <input
                type="range"
                id={`skill-${index}`}
                min="0"
                max="10"
                value={skill.level}
                onChange={e => handleSkillRating(index, parseInt(e.target.value))}
              />
              <span>{skill.level}</span>
            </div>
          ))}
          <button onClick={calculateQualification}>Calculate Qualification</button>
        </>
      )}

      {qualificationChartData && (
        <>
          <h2>Qualification Chart:</h2>
          <Bar data={qualificationChartData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
