import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Privacy - BeFake',
}

export default function Privacy({ params }: { params: { lng: string }}) {
  if (params.lng == "fr") {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Politique de confidentialité de BeFake</h1>
          <p className="mb-4">Date d'effet : 26/03/2024</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Introduction</h2>
            <p>
              Bienvenue dans la Politique de confidentialité de BeFake, un client personnalisé pour la plateforme BeReal. Nous accordons la priorité à votre confidentialité et visons à expliquer clairement et avec transparence les modalités de traitement de vos données.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Non Collecte de Données Personnelles</h2>
            <p>
              Chez BeFake, votre confidentialité est primordiale. Nous ne collectons aucune donnée personnelle lorsque vous utilisez notre application. Nous croyons fermement en votre droit de contrôler vos informations et de garantir qu'elles restent vôtres.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Collecte et Utilisation des Données</h2>
            <p>
              BeFake est conçu pour permettre l'accès à la plateforme BeReal sans collecter de données personnelles. Nous ne recueillons ni ne stockons d'informations relatives à votre identité, votre emplacement ou tout autre détail personnel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Disponibilité du Code Source</h2>
            <p>
              La transparence est fondamentale chez BeFake. Notre code source est disponible pour examen et vérification sur <a href="https://github.com/BeFake-Client/BeFake" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://github.com/BeFake-Client/BeFake</a>. En fournissant un accès à notre code source, nous démontrons notre engagement envers l'ouverture et la responsabilité, permettant aux utilisateurs de prendre des décisions éclairées sur leurs interactions numériques.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Contactez-nous</h2>
            <p>
              Si vous avez des questions, des préoccupations ou des interrogations concernant cette Politique de confidentialité ou le fonctionnement de l'application BeFake, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:FHDEV@proton.me" className="text-blue-500">FHDEV@proton.me</a>.
            </p>
          </section>
        </div>
      </div>
  )} else {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy for BeFake</h1>
          <p className="mb-4">Effective Date: 26/03/2024</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Introduction</h2>
            <p>
              Welcome to the Privacy Policy for BeFake, a custom client for the BeReal platform. We prioritize your privacy and aim to explain how we handle your data clearly and transparently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">No Collection of Personal Data</h2>
            <p>
              At BeFake, your privacy is paramount. We do not collect any personal data while you use our app. We firmly believe in your right to control your information and ensure it remains yours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Data Collection and Usage</h2>
            <p>
              BeFake is designed to provide access to the BeReal platform without collecting any personal data. We neither gather nor store information related to your identity, location, or any other personal details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Source Code Availability</h2>
            <p>
              Transparency is fundamental to BeFake. Our source code is available for review and scrutiny at <a href="https://github.com/BeFake-Client/BeFake" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://github.com/BeFake-Client/BeFake</a>. By providing access to our source code, we demonstrate our commitment to openness and accountability, empowering users to make informed decisions about their digital interactions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have any inquiries, concerns, or questions regarding this Privacy Policy or how the BeFake app operates, feel free to reach out to us at <a href="mailto:FHDEV@proton.me" className="text-blue-500">FHDEV@proton.me</a>.
            </p>
          </section>
        </div>
      </div>
  )}
};