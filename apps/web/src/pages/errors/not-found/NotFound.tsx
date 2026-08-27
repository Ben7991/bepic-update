import { ArrowLeft } from 'lucide-react';

import notFound from '../../../assets/not-found.svg';
import { Button } from '../../../components/atoms/button/Button';
import { Headline } from '../../../components/atoms/headline/Headline';
import { AppLogo } from '../../../components/molecules/app-logo/AppLogo';

export function NotFound(): React.JSX.Element {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-11/12 text-center md:w-2/3 lg:w-2/4 xl:w-2/5">
        <div className="flex justify-center">
          <AppLogo />
        </div>
        <img
          src={notFound}
          alt="Not found"
          className="w-87.5 md:w-112.5 xl:w-150 inline-block"
        />
        <Headline tag="h1">Page not found</Headline>
        <p className="mb-5">
          Sorry!!!, the page you are trying to reach does not exist, please use
          the link below to be redirected back to your previous page
        </p>
        <Button
          el="link"
          variant="primary"
          to="/"
          className="inline-flex! items-center gap-2"
        >
          <ArrowLeft className="w-4" />
          <span>Go Back</span>
        </Button>
      </div>
    </section>
  );
}
