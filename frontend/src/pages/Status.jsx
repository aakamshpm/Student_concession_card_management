import { useGetStudentDataQuery } from "../slices/studentsApiSlice";

const Status = () => {
  const { data: studentData } = useGetStudentDataQuery();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="border-2 border-black rounded-lg mt-10 p-3">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border-[1px] border-stone-800 text-lef p-2">
              Field
            </th>
            <th className="border-[1px] border-stone-800 text-left p-2">
              Status
            </th>
            <th className="border-[1px] border-stone-800 text-left p-2">
              Applied Date
            </th>
            <th className="border-[1px] border-stone-800 text-left p-2">
              Last Updated
            </th>
            <th className="border-[1px] border-stone-800 text-left p-2">
              Reason for denial
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID Verification</td>
            <td>{studentData?.eligibility?.status}</td>
            <td></td>
            <td>{formatDate(studentData?.eligibility?.lastUpdated)}</td>
            <td>{studentData?.eligibility?.reason || "Null"}</td>
          </tr>
          <tr>
            <td>Application</td>
            <td>{studentData?.application?.status}</td>
            <td></td>
            <td>{formatDate(studentData?.application?.lastUpdated)}</td>
            <td>{studentData?.application?.reason || "Null"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Status;
