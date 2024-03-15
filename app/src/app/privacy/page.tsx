import Head from 'next/head';

const Privacy = () => {
  return (
    <div className="p-8">
      <Head>
        <title>Privacy Policy - BeFake</title>
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy for BeFake</h1>
        <p className="mb-4">Effective Date: 16/03/2024</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Introduction</h2>
          <p>
            Hello, and welcome to the Privacy Policy for the BeFake, a custom client for the BeReal platform.
            I want to take a moment to inform you about the types of data our app collects, how we use it, and our commitment
            to prioritizing your privacy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">No Collection of Personal Data</h2>
          <p>
            Rest assured, your privacy is a top priority for us at BeFake. While you use our app, we do not collect any
            personal data from you. We firmly believe in empowering you to maintain control over your information, ensuring that
            your data always remains yours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Data Collection and Usage</h2>
          <p>
            I am proud to say that BeFake is designed in a way that grants you access to the BeReal platform without
            collecting any personal data whatsoever. As you engage with the app, we do not gather or store information related
            to your identity, location, or any other personal details.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Source Code Availability</h2>
          <p>
          At BeFake, transparency is key. We want you to feel confident in knowing exactly how our app operates. That's why we've made 
          the BeFake source code readily available for review and scrutiny at <a href="https://github.com/FH-DEV1/BeFake" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://github.com/FH-DEV1/BeFake</a>. By providing access to our source code, we aim 
          to demonstrate our commitment to openness and accountability, ensuring that our users can trust in the integrity of our platform. 
          Just like our approach to data privacy, we believe in empowering users with the information they need to make informed decisions 
          about their digital interactions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p>
            If you have any inquiries, concerns, or questions regarding this Privacy Policy or how the BeFake app operates,
            feel free to get in touch with us at <a href="mailto:FHDEV@proton.me" className="text-blue-500">FHDEV@proton.me</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;