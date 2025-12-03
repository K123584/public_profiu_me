import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material";
import { securedAxios as axios } from "../../axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setAuth } from "../../store/authSlice";

interface LoginUserType {
    username: string;
    mail: string;
    password: string;
}

function LoginInputField() {
    const { register, handleSubmit, formState: { errors, isSubmitting, isValid} } = useForm<LoginUserType>({ mode: 'onChange' });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loginError, setLoginError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<LoginUserType> = async(data) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/login`, data, {

                withCredentials: true,
                headers: {
                        'Content-Type': 'application/json',
                        // 'Access-Control-Allow-Origin': '*',
                    },
            });

            if(response.status == 200) {
                dispatch(setAuth({ username: response.data.username, isAuthenticated: true, status: "succeeded" }));
                console.log('Response body:', response.data);
                console.log('submit success!');
                const redirectURL = response.data.redirectURL.replace(':username', data.username);
                navigate(redirectURL)
            } else {
                console.log('Failed to submit');
                setLoginError("ユーザー名かパスワードが違います");
            }
        } catch(error) {
            console.log('Error submitting data:', error);
            setLoginError("ユーザー名かパスワードが違います");
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
                <CardHeader title="ログイン" />
                <CardContent>
                    <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField
                            {...register('username', { required: true, minLength: 3, maxLength: 50, pattern: /^[a-z0-9]+$/ })}
                            fullWidth
                            id="outlined-basic"
                            label="ユーザネーム"
                            variant="outlined"
                            error={!!errors.username}
                            helperText={errors.username && "半角英(小文字)数字で3文字以上50文字以下で入力してください"}
                        />
                        <div>
                            <TextField
                            {...register('password', { required: true, minLength: 8, maxLength: 16, pattern: /^[a-zA-Z0-9]+$/ })}
                            fullWidth
                            id="outlined-password-input"
                            label="パスワード"
                            type="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password && "半角英数字8文字以上16文字以下で入力してください"}
                            />
                        </div>
                        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

                        {/* CardActionsをform内に */}
                        <CardActions>
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
                            ログインする
                            </Button>
                        </CardActions>
                    </Box>
                </CardContent>
            </Card>
        </Box>
        
    )
}

export default LoginInputField;