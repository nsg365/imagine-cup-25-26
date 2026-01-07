export default function Vitals() {
  const patientId = localStorage.getItem("patient_id");

  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const poller = setInterval(() => {
      axios
        .get(`http://127.0.0.1:8000/vitals/${patientId}`)
        .then((res) => {
          setVitals(res.data);
          setLoading(false);
        })
        .catch(() => {});
    }, 2000);

    return () => clearInterval(poller);
  }, [patientId]);
}
