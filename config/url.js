import env from './env'

const DEV_URL = 'http://info.sppm.tsinghua.edu.cn/sppmtest/server'
// const DEV_URL = 'http://localhost:9081/'
const STAGE_URL = 'http://info.sppm.tsinghua.edu.cn/sppmtest/server'
const PRO_URL = 'http://info.sppm.tsinghua.edu.cn/sppm/server'

export default env === 'development' ? DEV_URL : env === 'stage' ? STAGE_URL : PRO_URL
