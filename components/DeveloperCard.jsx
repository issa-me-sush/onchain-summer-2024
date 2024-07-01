import Link from "next/link";
const DeveloperCard = ({ developer }) => {
  return (
    <div className=" bg-white shadow-clay-card rounded-[30px] py-6 flex flex-col items-center w-full max-w-sm">
      <div className="photo-wrapper mb-4">
        <img className="w-24 h-24 rounded-full mx-auto" src={developer.profileUrl} alt={`${developer.githubUsername}'s avatar`} />
      </div>
      <div className="text-center">
        <h3 className="text-xl text-gray-900 font-medium leading-8">{developer.githubId}</h3>
        <div className="text-gray-400 text-xs font-semibold">
          <p>Web Developer</p>
        </div>
        <table className="text-xs my-3 w-full">
          <tbody>
            <tr>
              <td className="px-2 py-2 text-gray-500 font-semibold">Attestations</td>
              <td className="px-2 py-2">{developer.attestations}</td>
            </tr>
            <tr>
              <td className="px-2 py-2 text-gray-500 font-semibold">Score</td>
              <td className="px-2 py-2">{developer.score}</td>
            </tr>
          </tbody>
        </table>
        <div className="my-3">
          <Link className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" href={`/publicprofile/${developer.githubId}`}>View Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
