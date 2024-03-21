import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, Box, CircularProgress, Backdrop } from '@mui/material';

// const languageOptions = ['C++', 'Java', 'JavaScript', 'Python'];
const languageIdMap = {
    'C++': 52,
    'Java': 62,
    'JavaScript': 63,
    'Python': 71,
  };

const SubmissionForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    code_language: '',
    stdin: '',
    source_code: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchResult = async (token, maxAttempts = 15, interval = 1000, attempt = 0) => {
    try {
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status_id,language_id,status`, {
            method: 'GET',
            headers: {  
                'X-RapidAPI-Key': '2d012621femshcbb697322723f1cp14a486jsn121300496d81',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
        }); 
        
        if (!resultResponse.ok){
            console.log(resultResponse)
            throw new Error('Failed to fetch result from Judge0.');
        } 

        const resultData = await resultResponse.json();
        
        if (resultData.status_id > 2 || attempt >= maxAttempts) { // Assuming status_id > 2 indicates completion
            console.log("Exceeded max attempts: ", resultData)
            return resultData;
          } else {
            // Wait for a bit before trying again
            await new Promise(resolve => setTimeout(resolve, interval));
            return fetchResult(token, maxAttempts, interval, attempt + 1);
          }
    }
    catch (e) {
        console.error('Error fetching result:', e);
      throw e;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const submissionPayload = {
        source_code: btoa(formData.source_code),
        language_id: languageIdMap[formData.code_language],
        stdin: btoa(formData.stdin),
      };


    try {
        
        const submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '2d012621femshcbb697322723f1cp14a486jsn121300496d81',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify(submissionPayload),
        })
        
        if (!submissionResponse.ok){
            console.log("Submission Response: ", submissionResponse)
            throw new Error('Failed to submit code to Judge0.');
        }
      
        const submissionData = await submissionResponse.json();
        console.log("Token upon submission: ", submissionData)
        
        const resultData = await fetchResult(submissionData.token);
        
        if(resultData.stdout!=null) resultData.stdout = atob(resultData.stdout)
        else{
            resultData.stderr = resultData.status.description;
        }
        console.log("Result obtained from judge0: ", resultData)
        

      const response = await fetch('http://localhost:3000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,stdout: resultData.stdout, stderr: resultData.stderr }),
      });
      console.log("Response from server: ", response)
      if (!response.ok) throw new Error('Network response was not ok.');

      setIsSubmitting(false);
      alert('Submission successful!');
      setFormData({ username: '', code_language: '', stdin: '', source_code: '' }); // Reset form
    } catch (error) {
        setIsSubmitting(false);
        console.log(error)
      alert(`Submission failed: ${error.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
      />
      <FormControl fullWidth margin="normal">
        <TextField
          select
          label="Preferred Code Language"
          value={formData.code_language}
          onChange={handleChange}
          name="code_language"
          required
        >
          {Object.keys(languageIdMap).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <TextField
        margin="normal"
        required
        fullWidth
        name="source_code"
        label="Source Code"
        type="text"
        id="sourceCode"
        multiline
        rows={4}
        value={formData.source_code}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        name="stdin"
        label="Standard Input (stdin)"
        type="text"
        id="stdin"
        multiline
        rows={2}
        value={formData.stdin}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
        Submit
      </Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default SubmissionForm;
