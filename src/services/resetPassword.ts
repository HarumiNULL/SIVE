import API from '../services/api';

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await API.post('password_reset/', { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
export const confirmResetPassword = async (token: string, newPassword: string) => {
  try {
    const response= await API.post('password_reset/confirm/', { token, password: newPassword },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};