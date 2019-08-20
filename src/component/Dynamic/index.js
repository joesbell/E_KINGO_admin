import dynamic from '@symph/joy/dynamic'
import DynamicLoading from '../DynamicLoading'

const Dynamic = function (loader) {
  return dynamic({
    loader,
    loading: DynamicLoading
  })
}
export default Dynamic
