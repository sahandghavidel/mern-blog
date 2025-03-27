import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6'>
      <h1 className='text-4xl font-bold text-center'>Explore Our Projects</h1>
      <p className='text-lg text-gray-600 text-center max-w-3xl'>
        Dive into a collection of fun and engaging projects designed to help you
        learn and master HTML, CSS, and JavaScript. Whether you're a beginner or
        an experienced developer, these projects will challenge your skills and
        inspire creativity. Start building today and take your development
        journey to the next level!
      </p>
      <div className='w-full flex flex-col gap-6'>
        <section className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold dark:text-gray-900'>
            Why Build Projects?
          </h2>
          <p className='text-gray-700 mt-2'>
            Building projects is one of the best ways to learn programming. It
            allows you to apply theoretical knowledge in a practical way, solve
            real-world problems, and create a portfolio that showcases your
            skills to potential employers or clients.
          </p>
        </section>
        <section className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold dark:text-gray-900'>
            What You'll Learn
          </h2>
          <ul className='list-disc list-inside text-gray-700 mt-2'>
            <li>How to structure HTML for clean and semantic code</li>
            <li>Styling with CSS to create visually appealing designs</li>
            <li>Adding interactivity with JavaScript</li>
            <li>Debugging and problem-solving techniques</li>
            <li>Best practices for responsive and accessible web design</li>
          </ul>
        </section>
      </div>
      <CallToAction />
    </div>
  );
}
