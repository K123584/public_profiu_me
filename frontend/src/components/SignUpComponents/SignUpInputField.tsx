import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SignUp from '../../pages/SignUp';
import { SubmitHandler, useForm } from 'react-hook-form';
import { securedAxios as axios } from '../../axios';
import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../store/hooks';
import { setAuth } from '../../store/authSlice';



interface SignUpUserType {
    username: string;
    mail: string;
    password: string;
}

function SignUpInputField() {
    const {register, handleSubmit, formState: { errors, isSubmitting, isValid}} = useForm<SignUpUserType>({ mode: 'onChange' });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cardStyle = {
        display: "block",
        transitionDuration: "0.3s",
        height: "450px",
        width: "400px",
        variant: "outlined",
    };

    const onSubmit: SubmitHandler<SignUpUserType> = async (data) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/signup`, data, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            dispatch(setAuth({ username: response.data.username, isAuthenticated: true, status: "succeeded" }));
            const redirectURL = response.data.redirectURL.replace(':username', data.username);
            navigate(redirectURL)
        }
      } catch (error: any) {
          if (error.response?.status === 409) {
              alert(error.response.data.error); // ユーザー名重複時のメッセージ
          } else {
              alert('登録に失敗しました');
          }
      }
    };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={{ xs: 2, sm: 4, md: 8, lg: 10 }} 
      minHeight="80vh"
      >
    
      <Card 
        sx={{
            width: "100%",
            maxWidth: 400,
            height: "auto",
            mx: "auto",
            boxSizing: "border-box",
        }}
      >
        <CardHeader title="ユーザ登録" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <TextField 
            {...register('username', {required: true, minLength: 1, pattern: /^[a-z0-9]+$/})}
            id="outlined-basic" 
            label="ユーザーネーム" 
            variant="outlined" 
            error={!!errors.username}
            helperText={errors.username && "半角英(小文字)数字1で文字以上で入力してください"}
            
          />
          <TextField 
            {...register('mail', {required: true, minLength: 1, pattern: /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/})}
            id="outlined-basic-mail" 
            label="メールアドレス" 
            variant="outlined"
            error={!!errors.mail}
            helperText={errors.mail && "メールアドレスを入力してください"}
          />

          <TextField
          {...register('password', {required: true, minLength: 8, maxLength: 16, pattern: /^[a-zA-Z0-9]+$/})}
              id="outlined-password-input"
              label="パスワード"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password && "半角英数字8文字以上16文字以下で入力してください"}
          
          />
          {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
          
          {errors.username && <div style={{ color: 'red' }}>{errors.username.message}</div>}
          {errors.mail && <div style={{ color: 'red' }}>{errors.mail.message}</div>}

          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            sx={{
                mt: 3,
                mb: 2,
                marginLeft: 2,
            }}
          >
            登録する
          </Button>
        </Box>
      </CardContent>

        
        
      </Card>
    </Box>
  );
}

export default  SignUpInputField;