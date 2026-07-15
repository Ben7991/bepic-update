/* eslint-disable @next/next/no-img-element */

import { Container, Row } from "@/components/atoms/grid/Grid";
import { Headline } from "@/components/atoms/headline/Headline";
import { Footer } from "@/components/organisms/footer/Footer";
import { Header } from "@/components/organisms/header/Header";
import { AdCard, GalleryCard } from "./page.partials";

export default function Home(): React.JSX.Element {
  return (
    <>
      <Header />
      <main>
        <article className="text-center py-5 md:py-12">
          <Container className="xl:w-1/2!">
            <Headline tag="h1" className="mb-3">
              Your Ambition. Our Community. Shared Success.
            </Headline>
            <p>
              You are in business for yourself, but never by yourself. Join a
              thriving global network of entrepreneurs dedicated to lifting each
              other up. We offer the tools, training, and ecosystem to turn your
              drive into sustainable growth.
            </p>
          </Container>
        </article>
        <article className="mb-3">
          <Container>
            <Row className="flex-col md:justify-evenly md:flex-row md:flex-wrap gap-3">
              <AdCard
                imgPath="/people.svg"
                alt="Distributors icon"
                details="1,570,000"
                title="Distributors"
              />
              <AdCard
                imgPath="/product.svg"
                alt="Products icon"
                details="1,570,000"
                title="Products"
              />
              <AdCard
                imgPath="/location.svg"
                alt="Location icon"
                details="Serbia, India & China"
                title="Headquarters"
              />
            </Row>
          </Container>
        </article>
        <article className="py-5 md:py-12">
          <Container>
            <Row className="md:items-center md:justify-between">
              <div className="w-full md:w-[48%]">
                <Headline tag="h3" className="mb-4">
                  About Us
                </Headline>
                <p className="mb-2">
                  Energy888 is a Global Network Marketing Company operating
                  direct sales operations in 17 countries worldwide, including
                  Ghana, as of 2025.
                </p>
                <p>
                  Look Mee Group operated in the Americas, Asia, and Europe,
                  finally Africa established this business on September 15th,
                  2014
                </p>
              </div>
              <div className="w-full md:w-[48%] relative">
                <img
                  src="/gallery-1.jpeg"
                  alt="The team behind the organization"
                  className="rounded-md"
                  loading="lazy"
                />
              </div>
            </Row>
          </Container>
        </article>
        <article className="py-5 md:py-12">
          <Container>
            <Headline tag="h3" className="mb-3 text-center">
              Gallery
            </Headline>
            <Row className="md:flex-wrap md:justify-between gap-5">
              <GalleryCard imgPath="/gallery-1.jpeg" alt="business image" />
              <GalleryCard imgPath="/gallery-2.jpeg" alt="business image" />
              <GalleryCard imgPath="/gallery-3.jpeg" alt="business image" />
              <GalleryCard imgPath="/gallery-4.jpeg" alt="business image" />
              <GalleryCard imgPath="/gallery-5.jpeg" alt="business image" />
              <GalleryCard imgPath="/gallery-6.jpeg" alt="business image" />
            </Row>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
