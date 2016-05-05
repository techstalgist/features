class FeatureForm extends React.Component{
  constructor() {
	  super();
  	  this.state= {
		  title:'',
		  description:'',
		  feature_type:'Core'
		  
  	  };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e){
	  var name = e.target.name;
	  this.setState({[name]: e.target.value});
  }
  
  handleSubmit(e){
  	  e.preventDefault();
	  var title = this.state.title.trim();
	  var description = this.state.description.trim();
	  var feature_type = this.state.feature_type.trim();
	  if (!title || !feature_type) {
	        return;
	  }
	  this.props.onFeatureSubmit({title: title, description: description, feature_type: feature_type});
	  this.setState({title: '', description: '', feature_type:''});
  }

  render(){
    return (
		<form onSubmit={this.handleSubmit}>
  	  		<div className="form-group">
  	  			<label>Title</label>
		<input type="text" className="form-control" placeholder="Title" name = "title" value={this.state.title} onChange={this.handleChange}></input>
  	  		</div>
 	   		<div className="form-group">
  	  			<label>Description</label>
   	 			<input type="text" className="form-control" placeholder="Description" name = "description" value={this.state.description} onChange={this.handleChange}></input>
 	   		</div>
 	   		<div className="form-group">
  	  			<label>Feature type</label>
 	   				<select className="form-control" name="feature_type" value={this.state.feature_type} onChange={this.handleChange}>
   	 					<option value="Core">Core</option>
   	 				    <option value="Support">Support</option>
  	  				</select>
 	   		</div>
  
			<button type="submit" className="btn btn-default">Create</button>
		</form>
    )
  }
}

class FeatureList extends React.Component {
  
  constructor() {
	  super();
	  this.handleFeatureUpdate = this.handleFeatureUpdate.bind(this);
	  this.handleFeatureDelete = this.handleFeatureDelete.bind(this);
	  
  }
  handleFeatureUpdate(data){	
	  this.props.onFeatureUpdate(data);
  }
  handleFeatureDelete(data){	
	  this.props.onFeatureDelete(data);
  }
  render() {
	  
	  return (
		  
			<div className="col-md-4 extra">
			<div className="panel panel-default">
  			  <div className="panel-heading">
   	   			<h3 className="panel-title">{this.props.type}</h3>
  			  </div>
			  <div className="row">
	            <div className="col-md-12 col-sm-12">
	              <ul className="list-group">
		         
				  { this.props.features.map(function(feature){
					  
	  					return (
	  	                  <Feature key={ feature.id } 
	  	                         feature={ feature } onFeatureUpdate={this.handleFeatureUpdate} onFeatureDelete={this.handleFeatureDelete}/>
	  	                )
	              }, this)}
				 
				  </ul>
				  
	            </div>
		     </div>
	        </div>
		    </div>
	        
	      )
  }
}

class Features extends React.Component {

	constructor() {
		super();
		this.state = {
			core_features: [],
			supporting_features: []
		};
		
	}
  componentWillMount() {
	  this.loadFeaturesFromServer();
  }
  
  loadFeaturesFromServer() {
      
	  $.ajax({
		method: 'GET',
        url: '/features',
        dataType: 'json',
        cache: false,
        success: (data) => {
          this.setState({core_features: data["core_features"], supporting_features: data["supporting_features"]})
        }
      });
    }
  componentDidMount() {
      setInterval(() => this.loadFeaturesFromServer(), 5000);
    }
  
   handleNewFeature(feature){
	   
	   if(feature.feature_type=="Core"){
		   var newCoreFeatures = React.addons.update(this.state.core_features, {$push: [feature]});
		   this.setState({core_features: newCoreFeatures});
	   } else {
		   var newSuppFeatures = React.addons.update(this.state.supporting_features, {$push: [feature]});
		   this.setState({supporting_features: newSuppFeatures});
	   }
   }
   
   handleRemoveFeature(feature){
	
		   var index = this.state.core_features.map(function(feat) { return feat.id; }).indexOf(feature.id);
		 
		   if(index!=-1){
			  var newCoreFeatures = React.addons.update(this.state.core_features, { $splice: [[index, 1]] });
		   	  this.setState({core_features: newCoreFeatures});
	       } else {
	       	  index = this.state.supporting_features.map(function(feat) { return feat.id; }).indexOf(feature.id);
   		   	  var newSuppFeatures = React.addons.update(this.state.supporting_features, { $splice: [[index, 1]] });
   		      this.setState({supporting_features: newSuppFeatures});
	       }
		
   }
   
   handleUpdatedFeature(feature){
	   if(feature.feature_type=="Core"){
		   var index = this.state.core_features.map(function(feat) { return feat.id; }).indexOf(feature.id);
		   if(index!=-1){
			   var newCoreFeatures = React.addons.update(this.state.core_features, { $splice: [[index, 1, feature]] });
	           this.setState({core_features: newCoreFeatures, supporting_features: this.state.supporting_features});
		   } else {
			   this.handleRemoveFeature(feature);
			   this.handleNewFeature(feature);
		   }
	   } else {
		   var index = this.state.supporting_features.map(function(feat) { return feat.id; }).indexOf(feature.id);
		   
		   if(index!=-1){
			   var newSuppFeatures = React.addons.update(this.state.supporting_features, { $splice: [[index, 1, feature]] });
	           this.setState({supporting_features: newSuppFeatures});
		   } else {
			   this.handleRemoveFeature(feature);
			   this.handleNewFeature(feature);
		   }
	   }
   }
  handleFeatureSubmit(feature) {
      $.ajax({
        url: '/features',
        dataType: 'json',
        type: 'POST',
        data: feature,
        success: (data) => {
			this.handleNewFeature(data)
        }
      });
    }
	
    handleFeatureUpdate(feature) {
		
        $.ajax({
		  url: '/features/' + feature["id"],
          dataType: 'json',
          type: 'PUT',
          data: feature,
          success: (data) => {
			  this.handleUpdatedFeature(data)
          }
        });
      }
	  
	  handleFeatureDelete(feature){
          $.ajax({
  		  url: '/features/' + feature["id"],
            dataType: 'json',
            type: 'DELETE',
            success: (data) => {
				this.handleRemoveFeature(data)
            }
          });
	  }
  render() {
	  
	  return (
		  <div>
		  	<div className="row">
		    {/* state should be passed to children. but only the owner has the state, the children should only use props, because the owner owns the state.*/}
		   		<div className="col-md-12">
		 	 		<FeatureList features={this.state.core_features} type="Core features" onFeatureUpdate={this.handleFeatureUpdate.bind(this)} onFeatureDelete={this.handleFeatureDelete.bind(this)}/>
					<FeatureList features={this.state.supporting_features} type="Supporting features" onFeatureUpdate={this.handleFeatureUpdate.bind(this)} onFeatureDelete={this.handleFeatureDelete.bind(this)}/>
		    	</div>
			</div>
		  	<div className="col-md-4">
		  		<FeatureForm onFeatureSubmit={this.handleFeatureSubmit.bind(this)}/>
		    </div>
		  </div>
	      )
  }
}

ReactDOM.render(
 <Features />, document.getElementById('features-app')
);




class Feature extends React.Component {
  
	constructor() {
		super();
		this.handleDelete = this.handleDelete.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}
  
  handleUpdate(e){
	  
  	  e.preventDefault();
	  var data = {id: this.props.feature.id, title: ReactDOM.findDOMNode(this.refs.title).value,
	  		   description: ReactDOM.findDOMNode(this.refs.description).value,
	   	 		feature_type: ReactDOM.findDOMNode(this.refs.feature_type).value};
	
	  this.props.onFeatureUpdate(data);
  }
  
  handleDelete(e){
	  e.preventDefault();
	  var data = {id: this.props.feature.id, 
		      feature_type: ReactDOM.findDOMNode(this.refs.feature_type).value};
	  this.props.onFeatureDelete(data);
  }

  render(){
    return (
      

 	   <li className="list-group-item">

		<form onSubmit={this.handleUpdate}>		
		<table className="table custom">
  			
			<tbody>
			<tr>
				<td className="col-md-1 bolded">Title: </td>
		    	<td>
					<input type="text" className="form-control" ref = "title" defaultValue={ this.props.feature.title }></input>
				</td>
		
			</tr>
  			<tr>
				<td className="col-md-1 bolded">Description: </td>
		    	<td>
					<input type="text" className="form-control" ref = "description" defaultValue={ this.props.feature.description }></input>
				</td>
			</tr>
  			<tr>
				<td className="col-md-1 bolded">Type: </td>
		    	<td>
					
 	   				<select className="form-control" ref="feature_type" defaultValue={this.props.feature.feature_type}>
   	 					<option value="Core">Core</option>
   	 				    <option value="Support">Support</option>
  	  				</select>

				</td>
			</tr>
		     <tr>
				<td>
				<button type="submit" className="btn btn-default">Save</button>
		     	</td>
				<td>
				<button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
		     	</td>
			 </tr>
		    </tbody>
			
		
			
		</table>
        </form>
	    </li>
    )
  }
}