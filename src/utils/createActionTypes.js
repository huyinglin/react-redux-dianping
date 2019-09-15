const createActionTypes = (moudule, schema) => ({
  [`FETCH_${moudule}_REQUEST`]: `${schema}/FETCH_${moudule}_REQUEST`,
  [`FETCH_${moudule}_SUCCESS`]: `${schema}/FETCH_${moudule}_SUCCESS`,
  [`FETCH_${moudule}_FAILURE`]: `${schema}/FETCH_${moudule}_FAILURE`,
});

export default createActionTypes;