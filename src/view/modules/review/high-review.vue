<template>
  <div class="search">
    <Card>
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Col span="7">
            <Form-item label="报考方向" prop="username">
              <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                <Option value=1>2020公共管理硕士</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="4" class="btn_group">
            <Button @click="handleSearch" type="primary" class="Purple_border">搜索</Button>
            <Button @click="handleSearch">清除</Button><!-- icon="ios-trash-outline"-->
          </Col>
        </Form>
      </Row>
      <Row>
        <tables :loading="loading" ref="table" size="small" v-model="userData" :columns="columns" />
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" current.sync="currPage" :current="currPage" :page-size="limit" @on-change="changePage" @on-page-size-change='handlePageSize' show-total show-sizer></Page>
      </Row>
    </Card>

    <!--查看 start-->
    <Modal title="查看" v-model="userModalVisible" :mask-closable='false' :width="500" class-name="vertical-center-modal">
      <Form ref="userForm" :model="userForm" :label-width="80" :rules="userFormValidate">
        <FormItem label="姓名" prop="inclass">
          刘青青
        </FormItem>
        <FormItem label="面试申请号" prop="inclass">
          20162615
        </FormItem>
        <FormItem label="评审状态" prop="status">
          未评审
        </FormItem>
        <FormItem label="填写比例" prop="status">
          <Progress :percent="25" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="userModalVisible = false">确定</Button>
      </div>
    </Modal>
    <!-- 查看 end-->

    <!--评审分数 start-->
    <Modal title="评审" v-model="review" class-name="vertical-center-modal">
      <Form ref="userForm" :model="userForm" :label-width="90" :rules="userFormValidate">
        <FormItem label="评审分数" prop="inclass">
          <Input type="text" v-model="searchForm.username" clearable placeholder="请输入评审分数" style="width:100%" />
        </FormItem>
        <p style="padding-left:30px">说明：评审教师评审后，评审分数不可再修改。</p>
      </Form>
      <div slot="footer">
        <Button @click="review = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="review = false">保存</Button>
      </div>
    </Modal>
    <!--评审分数 end-->

    <!-- 查看详细信息 start-->
    <Modal title="详情" v-model="modalView" :mask-closable='false' :width="1170" class-name="vertical-center-modal popup_detail" :styles="{top: '20px'}">
      <div class="detail_cont ">
        <Row :gutter="16">
          <Col span="3" class="popup_title">
          <ul class="left_ul">
            <li class="active"><a href="">基本信息</a></li>
            <li><a href="">工作经历</a></li>
            <li><a href="">学习经历</a></li>
            <li><a href="">论文著作</a></li>
            <li><a href="">联系方式</a></li>
            <li><a href="">学历信息</a></li>
            <li><a href="">推荐人</a></li>
            <li><a href="">材料</a></li>
          </ul>
          </Col>
          <Col span="21">
          <div class="right_cont">
            <!--基本信息 start-->
            <div class="baseinformation" style="display:">
              <div class="popup_title">
                <p>
                  <Icon type="ios-person-outline" />基本信息</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormValidate">
                  <Col span="11">
                  <Form-item label="项目名称">
                    2020年清华大学-香港城市大学
                  </Form-item>
                  <FormItem label="面试申请号">
                    25678654
                  </FormItem>
                  <Form-item label="申请者姓名">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="刘青青" />
                  </Form-item>
                  <Form-item label="姓名拼音">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="Liu Qingqign" />
                  </Form-item>
                  <Form-item label="考生来源">
                    <Select v-model="searchForm.status" placeholder="请选择考生来源" clearable>
                      <Option value=1>大陆</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="性别">
                    <Select v-model="searchForm.status" placeholder="请选择性别" clearable>
                      <Option value=1>男</Option>
                      <Option value=1>女</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="出生日期">
                    <DatePicker type="daterange" split-panels placeholder="请选择出生日期" style="width:100%"></DatePicker>
                  </Form-item>

                  </Col>
                  <Col span="11">
                  <Form-item label="证件类型">
                    <Select v-model="searchForm.status" placeholder="请选择" clearable>
                      <Option value=1>二代身份证</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="证件号">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入证件号" />
                  </Form-item>
                  <Form-item label="通行证类型">
                    <Select v-model="searchForm.status" placeholder="请选择" clearable>
                      <Option value=1>二代身份证</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="通行证码">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入通行证码" />
                  </Form-item>
                  <Form-item label="现工作单位">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入现工作单位" />
                  </Form-item>
                  <Form-item label="职务">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入职务" />
                  </Form-item>
                  <Form-item label="出生地">
                    <Select v-model="searchForm.status" placeholder="请选择" clearable>
                      <Option value=1>北京市</Option>
                    </Select>
                  </Form-item>

                  </Col>
                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:50px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">下一页</Button>
                <Button type="primary" :loading="submitLoading" @click="setup = false">确认</Button>
                </Col>
              </div>

            </div>
            <!--基本信息 end-->

            <!--工作经历 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-document-outline" />工作经历</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="90" :rules="userFormValidate">
                  <Col span="20" offset="1">
                  <p style="margin:10px 0 ">工作经历一</p>
                  <div class="gray_bg" style="padding-top:30px">
                    <Form-item label="起止年月">
                      <Col span="9">
                      <DatePicker type="date" placeholder="选择开始时间" v-model="searchForm.date" style="width:100%"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="9">
                      <DatePicker type="date" placeholder="选择结束时间" v-model="searchForm.date" style="width:100%"></DatePicker>
                      </Col>
                      <Col span="4" style="padding-left:20px">
                      <CheckboxGroup v-model="userForm.checkbox">
                        <Checkbox label="至今"></Checkbox>
                      </CheckboxGroup>
                      </Col>

                    </Form-item>
                    <Form-item label="工作单位名称">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入工作单位名称" />
                    </Form-item>
                    <Form-item label="职位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入职位" />
                    </Form-item>
                  </div>
                  </Col>

                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:120px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--工作经历 end-->

            <!--学习经历 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-create-outline" />学习经历</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="80" :rules="userFormValidate">
                  <Col span="22" offset="1">
                  <p style="margin: 10px 0">学习经历一</p>
                  <div class="gray_bg" style="padding-top:30px">
                    <Form-item label="起止年月">
                      <Col span="11">
                      <DatePicker type="date" placeholder="选择开始时间" v-model="searchForm.date" style="width:100%"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                      <DatePicker type="date" placeholder="选择结束时间" v-model="searchForm.date" style="width:100%"></DatePicker>
                      </Col>
                    </Form-item>
                    <Form-item label="学校名称">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入学校名称" />
                    </Form-item>
                    <Form-item label="学位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入学位" />
                    </Form-item>
                  </div>
                  </Col>

                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:120px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--学习经历 end-->

            <!--论文著作 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-paper-outline" />论文著作</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="90" :rules="userFormValidate">
                  <Col span="22" offset="1">
                  <p style="margin:10px 0">论文著作一</p>
                  <div class="gray_bg">
                    <Form-item label="论文著作类型">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入论文著作类型" />
                    </Form-item>
                    <Form-item label="作者">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入作者" />
                    </Form-item>
                    <Form-item label="论文著作题目">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入论文著作题目" />
                    </Form-item>
                    <Form-item label="出版社">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入出版社" />
                    </Form-item>
                    <Form-item label="状态">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入状态" />
                    </Form-item>
                  </div>
                  </Col>

                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:40px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--论文著作 end-->

            <!--联系方式 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-call-outline" />联系方式</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormValidate">
                  <Col span="12">
                  <Form-item label="通讯地址">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入通讯地址" />
                  </Form-item>
                  <Form-item label="邮政编码">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入邮政编码" />
                  </Form-item>
                  <Form-item label="电话区号">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入电话区号" />
                  </Form-item>
                  <Form-item label="固定电话">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入固定电话" />
                  </Form-item>
                  <Form-item label="移动电话">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入移动电话" />
                  </Form-item>
                  <Form-item label="传真号码">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入传真号码" />
                  </Form-item>
                  <Form-item label="电子邮箱">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入电子邮箱" />
                  </Form-item>
                  </Col>
                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:20px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button type="primary" :loading="submitLoading" @click="setup = false" style="margin-right:5px">保存</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--联系方式 end-->

            <!--学历信息 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-school-outline" />学历信息</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="140" :rules="userFormValidate">
                  <Col span="12">
                  <Form-item label="考生来源">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入考生来源" />
                  </Form-item>
                  <Form-item label="已有学历名称">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入已有学历名称" />
                  </Form-item>
                  <Form-item label="毕业学校名称">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入毕业学校名称" />
                  </Form-item>
                  <Form-item label="专业名称">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入专业名称" />
                  </Form-item>
                  <Form-item label="毕业学校所在地">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入毕业学校所在地" />
                  </Form-item>
                  <Form-item label="毕业年月">
                    <DatePicker type="daterange" split-panels placeholder="请选择毕业时间" style="width:100%"></DatePicker>
                  </Form-item>
                  <Form-item label="毕业证书编码">
                    <Input type="text" v-model="searchForm.username" clearable placeholder="请输入毕业证书编码" />
                  </Form-item>
                  </Col>
                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:10px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--学历信息 end-->

            <!--推荐人 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-contact-outline" />推荐人</p>
                <Divider />
              </div>
              <Row>
                <Form ref="userForm" :model="userForm" :label-width="80" :rules="userFormValidate">
                  <Col span="10" offset="1">
                  <p style="margin:0 0 10px">推荐人一</p>
                  <div class="gray_bg">
                    <Form-item label="推荐人姓名">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入推荐人姓名" />
                    </Form-item>
                    <Form-item label="单位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入单位" />
                    </Form-item>
                    <Form-item label="职位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入职位" />
                    </Form-item>
                    <Form-item label="联系电话">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入联系电话" />
                    </Form-item>
                    <Form-item label="电子邮箱">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入电子邮箱" />
                    </Form-item>
                  </div>
                  </Col>
                  <Col span="10" offset="1">
                  <p style="margin:0 0 10px">推荐人二</p>
                  <div class="gray_bg">
                    <Form-item label="推荐人姓名">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入推荐人姓名" />
                    </Form-item>
                    <Form-item label="单位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入单位" />
                    </Form-item>
                    <Form-item label="职位">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入职位" />
                    </Form-item>
                    <Form-item label="联系电话">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入联系电话" />
                    </Form-item>
                    <Form-item label="电子邮箱">
                      <Input type="text" v-model="searchForm.username" clearable placeholder="请输入电子邮箱" />
                    </Form-item>
                  </div>
                  </Col>
                </Form>
              </Row>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:60px 0 0;">
                <Button @click="setup = false" style="margin-right:5px">上一页</Button>
                <Button @click="setup = false">下一页</Button>
                </Col>
              </div>

            </div>
            <!--推荐人 end-->

            <!--材料 start-->
            <div class="baseinformation" style="display:none">
              <div class="popup_title">
                <p>
                  <Icon type="ios-list-box-outline" />材料</p>
                <Divider />
              </div>
              <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormValidate">
                <Col span="13">
                <Form-item label="中文个人陈述">
                  <p class="registration">
                    <a href="">
                      <Icon type="ios-copy-outline" style="margin:-3px 0 0;font-size:20px;vertical-align:middle" />附件1</a>
                  </p>
                  <p class="tips" style="margin:10px 0 0;line-height:1.2">不超过1000字，包括政治表现、外语水平、研究计划、职业经验与职业规划等</p>
                  <p class="tips">上传格式为.pdf的文件，大小为2M以内</p>
                </Form-item>
                <Form-item label="学士学位证明">
                  <p class="registration">
                    <a href="">
                      <Icon type="ios-copy-outline" style="margin:-3px 0 0;font-size:20px;vertical-align:middle" />附件1</a>
                  </p>
                  <p class="tips" style="margin:10px 0 0;line-height:1.2">学士学位在内地（祖国大陆）高校获得的考生，须提供学士学位证书复印件，复印件上须加盖学校公章。</p>
                  <p class="tips">学士学位在中国内地以外地区获得的考生，须提供由中国内地留学服务中心出具的学位认证件原件。</p>
                  <p class="tips">上传格式为.pdf的文件，大小为2M以内</p>
                </Form-item>
                <Form-item label="成绩单">
                  <p class="registration">
                    <a href="">
                      <Icon type="ios-copy-outline" style="margin:-3px 0 0;font-size:20px;vertical-align:middle" />附件1</a>
                  </p>
                  <p class="tips" style="margin:10px 0 0;line-height:1.2">由就读学校官方签发的本科或以上成绩单。</p>
                  <p class="tips">上传格式为.pdf的文件，大小为2M以内</p>
                </Form-item>
                <Form-item label="在线推荐信">
                  <p class="registration">
                    <a href="">
                      <Icon type="ios-copy-outline" style="margin:-3px 0 0;font-size:20px;vertical-align:middle" />附件1</a>
                  </p>
                  <p class="tips" style="margin:10px 0 0;line-height:1.2">推荐人须为副教授或相应职称以上的学者，或者相关行业内的资深专业人士。</p>
                  <p class="tips">上传格式为.pdf的文件，大小为2M以内</p>
                </Form-item>
                <Form-item label="身份证">
                  <p class="registration">
                    <a href="">
                      <Icon type="ios-copy-outline" style="margin:-3px 0 0;font-size:20px;vertical-align:middle" />附件1</a>
                  </p>
                  <p class="tips" style="margin:10px 0 0;line-height:1.2">香港、澳门申请者须提供香港、澳门永久性居民身份证复印件和“港澳居民来往内地通行证”，台湾申请者须提供台湾居住的有效身份证明复印件和“台湾居民来往大陆通行证”。</p>
                  <p class="tips">上传格式为.pdf的文件，大小为2M以内</p>
                </Form-item>
                </Col>
              </Form>
              <div slot="footer" style="text-align:right">
                <Col span="24" style="margin:40px 0 10px;">
                <Button style="margin-right:5px">上一页</Button>
                </Col>
              </div>

            </div>
            <!--材料 end-->

          </div>
          </Col>
        </Row>
      </div>

    </Modal>
    <!-- 查看详细信息 end-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import api from '@/api/sys'
export default {
  name: 'usermanage',
  components: {
    Tables, api
  },
  data () {
    return {
      loading: false,
      review: false,
      modalView: false,
      addpersonnel: false,
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      statusList: [{ id: 1, name: '正常' }, { id: 0, name: '禁用' }],
      roleList: [],
      searchForm: {
        username: '',
        status
      },
      userForm: {
        userId: '',
        username: '',
        email: '',
        mobile: '',
        avator: '',
        status: 1,
        studentcategory: ''
      },
      userFormValidate: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        studentcategory: [{ required: true, type: 'array', min: 1, message: '角色不能为空', trigger: 'change' }]
      },
      submitLoading: false,
      selectList: [],
      selectCount: 0,
      columns: [
        {
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 80
        },
        {
          title: '面试申请号',
          key: 'number',
          minWidth: 120,
          className: 'font_color'
        },
        {
          title: '评审状态',
          key: 'reviewstatus',
          minWidth: 120,
          sortable: true
        },
        {
          title: '填写比例',
          key: 'proportion',
          minWidth: 120,
          sortable: true
        },
        {
          title: '评审成绩',
          key: 'achievements',
          minWidth: 120,
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-create-outline',

                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '打分'
              ),
              h(
                'Icon',
                {
                  props: {
                    type: 'ios-eye-outline',

                    size: '20'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      data2: [
        {
          title: '学生管理',
          expand: true,
          children: [
            {
              title: '学生管理',
              expand: true,
              children: [
                {
                  title: '学生管理'
                },
                {
                  title: '学生管理'
                }
              ]
            }
          ]
        }
      ],
      userData: [],
      totalCount: 0,
      currPage: 1,
      limit: 10
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style scoped>
.registration a {
  color: #3f3f3f;
}
.registration a:hover {
  color: #8c0e9e;
}
</style>
