import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SubmissionDetailsModal from './SubmissionModal';

const SubmissionsTable = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('https://code-submission-and-execution.onrender.com/api/submissions');
        console.log(response);
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        console.log(data.data);
        setSubmissions(data.data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table stickyHeader aria-label="submissions table">
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="fontWeightBold">Username</Typography></TableCell>
                <TableCell><Typography fontWeight="fontWeightBold">Code Language</Typography></TableCell>
                <TableCell><Typography fontWeight="fontWeightBold">Source Code (first 100 chars)</Typography></TableCell>
                <TableCell><Typography fontWeight="fontWeightBold">Stdin</Typography></TableCell>
                <TableCell><Typography fontWeight="fontWeightBold">Output</Typography></TableCell>
                <TableCell><Typography fontWeight="fontWeightBold">Submission Time</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleRowClick(submission)}>
                  <TableCell>{submission.username}</TableCell>
                  <TableCell>{submission.code_language}</TableCell>
                  <TableCell style={{ fontFamily: 'Monospace' }}>{submission.source_code.substring(0, 100)}</TableCell>
                  <TableCell style={{ fontFamily: 'Monospace' }}>{submission.stdin}</TableCell>
                  <TableCell>
                    {submission.stdout ? (
                      <>
                        <CheckCircleOutlineIcon color="success" />
                        <Typography variant="body2" component="span" style={{ fontFamily: 'Monospace', color: '#2e7d32' }}>
                          {submission.stdout}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <ErrorOutlineIcon color="error" />
                        <Typography variant="body2" component="span" style={{ fontFamily: 'Monospace', color: '#d32f2f' }}>
                          {submission.stderr}
                        </Typography>
                      </>
                    )}
                  </TableCell>
                  <TableCell>{new Date(submission.submission_time).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <SubmissionDetailsModal open={modalOpen} handleClose={handleCloseModal} submission={selectedSubmission} />
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default SubmissionsTable;
