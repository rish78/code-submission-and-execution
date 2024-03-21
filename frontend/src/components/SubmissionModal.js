import React from 'react';
import { Dialog, DialogContent, Grid, Typography, Box, Button } from '@mui/material';

const SubmissionDetailsModal = ({ open, handleClose, submission }) => {
  if (!submission) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom>Username</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>{submission.username}</Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" gutterBottom>Code Language</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>{submission.code_language}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom>Source Code</Typography>
            <Box style={{ whiteSpace: 'pre-wrap', fontFamily: 'Monospace', border: '1px solid #ccc', padding: 8, borderRadius: 4, maxHeight: '400px', overflowY: 'auto' }}>
              {submission.source_code}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom>Stdin</Typography>
            <Box style={{ whiteSpace: 'pre-wrap', fontFamily: 'Monospace', border: '1px solid #ccc', padding: 8, borderRadius: 4, marginBottom: 8, maxHeight: '195px', overflowY: 'auto' }}>
              {submission.stdin}
            </Box>
            <Typography variant="subtitle1" gutterBottom>Output</Typography>
            <Box style={{ whiteSpace: 'pre-wrap', fontFamily: 'Monospace', border: '1px solid #ccc', padding: 8, borderRadius: 4, color: submission.stdout ? '#2e7d32' : '#d32f2f', maxHeight: '195px', overflowY: 'auto' }}>
              {submission.stdout || submission.stderr}
            </Box>
          </Grid>
        </Grid>
        <Box textAlign="center" marginTop={2}>
          <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsModal;
