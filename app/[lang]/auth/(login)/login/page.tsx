'use client';
import Image from 'next/image';
import LogInForm from './login-form';
import background from '@/public/images/auth/mountain.png';
const LoginPage = () => {
  return (
    <div className="loginwrapper  flex justify-center items-center relative overflow-hidden">
      <Image
        src={background}
        alt="background image"
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="w-full bg-background py-5 max-w-xl  rounded-xl relative z-10 2xl:p-16 xl:p-12 p-10 m-4 ">
        <LogInForm />
      </div>
    </div>
  );
};

export default LoginPage;
